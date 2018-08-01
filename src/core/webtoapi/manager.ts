/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { ajv, chalk, cheerio, fs, md5, request, path } from '../../libraries';

import { BasicList } from '../includes/basic-types';
import { DRCollector, IManagerByKey } from '../drcollector';
import { Tools, ToolsCheckPath, IToolsCheckPathResult } from '../includes';
import { WAEndpoint, WAEndpointList, WAException, WAParsersList, WAUrlParameters } from './types';
import { WAParserAnchor, WAParserAnchorFull, WAParserAttribute, WAParserHtml, WAParserNumber, WAParserText, WAParserTrimText } from './parsers';
import { WebToApiConfigSpec } from './spec.config';
import { WebToApiRouter } from './router';
import { WAPostProcessorData } from './post-processor-data';
import { WAPreProcessorData } from './pre-processor-data';

declare var require: (path: string) => any;

export class WebToApi implements IManagerByKey {
    //
    // Protected properties.
    protected _cachePath: string = null;
    protected _config: any = null;
    protected _configPath: string = null;
    protected _customParsers: BasicList<any> = [];
    protected _endpoints: WAEndpointList = {};
    protected _loaded: boolean = false;
    protected _parsers: WAParsersList = {};
    protected _relativePath: string = null;
    protected _router: WebToApiRouter = null;
    //
    // Constructor.
    public constructor(configPath: string) {
        this._configPath = configPath;

        this.loadConfig();
        this.load();

        DRCollector.registerWebToApiManager(this);
    }
    //
    // Public methods.
    public cacheLifetime(): string {
        return this._config ? this._config.cacheLifetime : 300;
    }
    public cachePath(): string {
        return this._cachePath
    }
    public configPath(): string {
        return this._configPath;
    }
    public customParsers(): BasicList<any> {
        return Tools.DeepCopy(this._customParsers);
    }
    public description(): string {
        return this._config ? this._config.description : '';
    }
    public endpoints(): WAEndpointList {
        return this._endpoints
    }
    public has(type: string): boolean {
        return typeof this._endpoints[type] !== 'undefined';
    }
    public async get(type: string, params: WAUrlParameters) {
        let results: any = {};
        const key = this.genKey(type, params);

        if (this.has(type)) {
            const endpoint: any = this._endpoints[type];

            let preRequest: WAPreProcessorData = new WAPreProcessorData();
            preRequest.headers = Tools.DeepCopy(endpoint.headers);
            preRequest.endpoint = endpoint;
            preRequest.params = params;

            if (endpoint.preProcessor) {
                preRequest = await endpoint.preProcessor(preRequest);
            }

            if (preRequest.forceDownloading) {
                preRequest.forceAnalysis = true;
            }

            let reAnalyze: boolean = false;
            let raw: string = this.getRawCache(key, endpoint.cacheLifetime);
            if (raw === null || preRequest.forceDownloading) {
                reAnalyze = true;

                raw = null;
                try {
                    switch (endpoint.method.toUpperCase()) {
                        case 'GET':
                        default:
                            const options = {
                                url: this.adaptUrl(endpoint.url, preRequest.params),
                                headers: preRequest.headers
                            };
                            try {
                                raw = await request.get(options);
                            } catch (he) {
                                throw new WAException(`${he.name}: Code: ${he.statusCode}. Url: ${options.url}`);
                            }
                            break;
                    }
                } catch (e) {
                    console.error(chalk.red(`Error: ${e}`));
                }

                this.saveRawCache(key, raw);
            }

            results = reAnalyze ? null : this.getJSONCache(key, endpoint.cacheLifetime);
            if (!results || preRequest.forceAnalysis) {
                results = await this.analyze(key, raw, endpoint);
                this.saveJSONCache(key, results);
            }
        } else {
            throw new WAException(`Unknown type '${type}'`);
        }

        return results;
    }
    public matchesKey(key: string): boolean {
        return this._config && this._config.key === key;
    }
    public name(): string {
        return this._config ? this._config.name : '';
    }
    public parsers(): string[] {
        return Object.keys(this._parsers);
    }
    public relativePath(): string {
        return this._relativePath
    }
    public routes(): any[] {
        return this._config ? this._config.routes : [];
    }
    public router(): any {
        this.loadRouter();
        return this._router.expressRouter();
    }
    //
    // Protected methods.
    protected adaptUrl(url: string, params: WAUrlParameters): string {
        for (const k of Object.keys(params)) {
            const pat: RegExp = new RegExp(`:${k}:`, 'g');
            url = url.replace(pat, params[k]);
        }

        return url;
    }
    protected async analyze(key: string, data: string, endpoint: WAEndpoint) {
        let results: any = {};

        if (data) {
            const doc = cheerio.load(data, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            results = await this.analyzeFields(endpoint.fields, doc, doc('body'));

            if (endpoint.postProcessor) {
                let requestData: WAPostProcessorData = new WAPostProcessorData();
                requestData.data = results;
                requestData.endpoint = endpoint;

                requestData = await endpoint.postProcessor(requestData);
                results = requestData.data;
            }
        }

        return results;
    }
    protected async analyzeFields(fields: any[], mainDoc: any, mainElement: any): Promise<any> {
        let results: any = {};

        const parse: Function = async (field: any, element: any): Promise<any> => {
            let out: any = null;

            if (typeof field.fields !== 'undefined') {
                out = await this.analyzeFields(field.fields, mainDoc, element);
            } else {
                out = await this._parsers[field.parser](element, field.parserParams);
            }

            return out;
        }

        for (const field of fields) {
            const findings = mainElement.find(field.path);

            if (findings.length > 1) {
                results[field.name] = [];
                //
                // Why a copy to a list and two fors? well each doesn't seem to
                // allow async/await @{
                const elements: any[] = []
                findings.each((index: number, element: any) => {
                    if (field.index === null || field.index === index) {
                        elements.push(element);
                    }
                });
                for (const element of elements) {
                    let aux: any = await parse(field, mainDoc(element));
                    results[field.name].push(aux);
                }
                // @}
                if (field.index !== null && results[field.name].length > 0) {
                    results[field.name] = results[field.name][0];
                }
            } else {
                results[field.name] = await parse(field, findings);
            }

            if (findings.length > 0 && field.forceArray) {
                if (!Array.isArray(results[field.name])) {
                    if (results[field.name] !== null) {
                        results[field.name] = [results[field.name]];
                    } else {
                        results[field.name] = [];
                    }
                }
            }
        }

        return results;
    }
    protected genKey(type: string, params: WAUrlParameters): string {
        return md5(`[${type}][${JSON.stringify(params)}]`);
    }
    protected getCachePath(key: string): string {
        return path.join(this._cachePath, `cache.${key}`);
    }
    protected getCache(key: string, extension: string, lifetime: number): any {
        let results: any = null;
        const cachePath: string = `${this.getCachePath(key)}.${extension}`;

        const ppCheck: IToolsCheckPathResult = Tools.CheckFile(cachePath);
        if (ppCheck.status === ToolsCheckPath.Ok) {
            if ((Date.now() - Math.floor(ppCheck.stat.mtimeMs)) < (lifetime * 1000)) {
                try {
                    results = fs.readFileSync(cachePath).toString();
                } catch (e) { }
            }
        }

        return results;
    }
    protected getJSONCache(key: string, lifetime: number): any {
        let results: any = null;

        try { results = JSON.parse(this.getCache(key, 'json', lifetime)); } catch (e) { }

        return results;
    }
    protected getRawCache(key: string, lifetime: number): any {
        return this.getCache(key, 'html', lifetime);
    }
    protected load(): void {
        if (!this._loaded) {
            this._loaded = true;

            let validator = null;
            try {
                const ajvObj: any = new ajv({
                    useDefaults: true
                });
                validator = ajvObj.compile(WebToApiConfigSpec);
            } catch (e) {
                throw new WAException(`WebToApi::load(): ${e}`);
            }

            if (!validator(this._config)) {
                throw new WAException(`WebToApi::load(): Bad configuration. '\$${validator.errors[0].dataPath}' ${validator.errors[0].message}`);
            }

            if (typeof this._config.name === 'undefined') {
                this._config.name = path.basename(this._configPath);
            }

            let ppCheck: IToolsCheckPathResult = null;

            for (const endpoint of this._config.endpoints) {
                if (endpoint.preProcessor) {
                    ppCheck = Tools.CheckFile(endpoint.preProcessor, this._relativePath);
                    switch (ppCheck.status) {
                        case ToolsCheckPath.Ok:
                            try {
                                endpoint.preProcessorPath = ppCheck.path;
                                endpoint.preProcessor = require(ppCheck.path);
                            } catch (e) {
                                throw new WAException(`WebToApi::load(): Unable to load '${endpoint.preProcessor}'. ${e}`);
                            }
                            break;
                        case ToolsCheckPath.WrongType:
                            throw new WAException(`WebToApi::load(): '${endpoint.preProcessor}' is not a file`);
                        default:
                            throw new WAException(`WebToApi::load(): '${endpoint.preProcessor}' doesn't exist`);
                    }
                }

                if (endpoint.postProcessor) {
                    ppCheck = Tools.CheckFile(endpoint.postProcessor, this._relativePath);
                    switch (ppCheck.status) {
                        case ToolsCheckPath.Ok:
                            try {
                                endpoint.postProcessorPath = ppCheck.path;
                                endpoint.postProcessor = require(ppCheck.path);
                            } catch (e) {
                                throw new WAException(`WebToApi::load(): Unable to load '${endpoint.postProcessor}'. ${e}`);
                            }
                            break;
                        case ToolsCheckPath.WrongType:
                            throw new WAException(`WebToApi::load(): '${endpoint.postProcessor}' is not a file`);
                        default:
                            throw new WAException(`WebToApi::load(): '${endpoint.postProcessor}' doesn't exist`);
                    }
                }

                this._parsers['anchor'] = WAParserAnchor;
                this._parsers['anchor-full'] = WAParserAnchorFull;
                this._parsers['attr'] = WAParserAttribute;
                this._parsers['attribute'] = WAParserAttribute;
                this._parsers['html'] = WAParserHtml;
                this._parsers['number'] = WAParserNumber;
                this._parsers['text'] = WAParserText;
                this._parsers['trim-text'] = WAParserTrimText;

                for (const parser of this._config.parsers) {
                    ppCheck = Tools.CheckFile(parser.path, this._relativePath);
                    switch (ppCheck.status) {
                        case ToolsCheckPath.Ok:
                            try {
                                this._parsers[parser.code] = require(ppCheck.path);
                                this._customParsers.push({
                                    code: parser.code,
                                    path: ppCheck.path
                                });
                            } catch (e) {
                                throw new WAException(`WebToApi::load(): Unable to load '${parser.path}'. ${e}`);
                            }
                            break;
                        case ToolsCheckPath.WrongType:
                            throw new WAException(`WebToApi::load(): '${parser.path}' is not a file`);
                        default:
                            throw new WAException(`WebToApi::load(): '${parser.path}' doesn't exist`);
                    }
                }

                if (typeof endpoint.cacheLifetime === 'undefined' || endpoint.cacheLifetime < 0) {
                    endpoint.cacheLifetime = this._config.cacheLifetime;
                }

                this._endpoints[endpoint.name] = endpoint;
            }

            ppCheck = Tools.CheckDirectory(this._config.cachePath, this._relativePath);
            switch (ppCheck.status) {
                case ToolsCheckPath.Ok:
                    this._cachePath = ppCheck.path;
                    break;
                case ToolsCheckPath.WrongType:
                    throw new WAException(`WebToApi::load(): '${this._config.cachePath}' is not a directory`);
                default:
                    throw new WAException(`WebToApi::load(): '${this._config.cachePath}' doesn't exist`);
            }
        }
    }
    protected loadConfig(): void {
        if (!this._loaded) {
            let ppCheck: IToolsCheckPathResult = Tools.CheckFile(this._configPath);
            switch (ppCheck.status) {
                case ToolsCheckPath.Ok:
                    try {
                        this._config = JSON.parse(fs.readFileSync(ppCheck.path).toString());
                    } catch (e) {
                        throw new WAException(`WebToApi::loadConfig() Error: Unable to load '${this._configPath}'. ${e}`);
                    }
                    break;
                case ToolsCheckPath.WrongType:
                    throw new WAException(`WebToApi::loadConfig() Error: '${this._configPath}' is not a file.`);
                default:
                    throw new WAException(`WebToApi::loadConfig() Error: '${this._configPath}' doesn't exist.`);
            }

            this._relativePath = path.dirname(path.resolve(this._configPath));
        }
    }
    protected loadRouter() {
        if (!this._router) {
            this._router = new WebToApiRouter(this, this._endpoints, this._config);
        }
    }
    protected saveCache(key: string, data: string, extension: string) {
        if (data) {
            const cachePath = this.getCachePath(key);
            fs.writeFileSync(`${cachePath}.${extension}`, data);
        }
    }
    protected saveJSONCache(key: string, json: any) {
        this.saveCache(key, json ? JSON.stringify(json) : json, 'json');
    }
    protected saveRawCache(key: string, raw: string) {
        this.saveCache(key, raw, 'html');
    }
}
