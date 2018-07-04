/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { ajv, chalk, cheerio, fs, md5, request, path } from '../../libraries';

import { Tools, ToolsCheckPath, ToolsCheckPathResult } from '../includes';
import { WAEndpoint, WAEndpointList, WAException, WAParsersList, WAUrlParameters } from './types';
import { WAParserAttribute, WAParserNumber, WAParserText, WAParserTrimText } from './parsers';
import { WebToApiConfigSpec } from './spec.config';
import { WebToApiRouter } from './router';

declare var require: (path: string) => void;

export class WebToApi {
    //
    // Protected properties.
    protected _cachePath: string = null;
    protected _config: any = null;
    protected _configPath: string = null;
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
    }
    //
    // Public methods.
    public has(type: string): boolean {
        return typeof this._endpoints[type] !== 'undefined';
    }
    public async get(type: string, params: WAUrlParameters) {
        let results: any = {};
        const key = this.genKey(type, params);

        if (this.has(type)) {
            const endpoint: any = this._endpoints[type];

            let reAnalyze: boolean = false;
            let raw: string = this.getRawCache(key, endpoint.cacheLifetime);
            if (raw === null) {
                reAnalyze = true;

                raw = null;
                try {
                    switch (endpoint.method.toUpperCase()) {
                        case 'GET':
                        default:
                            raw = await request.get(this.adaptUrl(endpoint.url, params));
                            break;
                    }
                } catch (e) {
                    console.error(chalk.red(`Error: ${e}`));
                }

                this.saveRawCache(key, raw);
            }

            results = reAnalyze ? null : this.getJSONCache(key, endpoint.cacheLifetime);
            if (!results) {
                results = this.analyze(key, raw, endpoint);
                this.saveJSONCache(key, results);
            }
        } else {
            throw new WAException(`Unknown type '${type}'`);
        }

        return results;
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
    protected analyze(key: string, data: string, endpoint: WAEndpoint): any {
        let results: any = {};

        if (data) {
            const doc = cheerio.load(data, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            results = this.analyzeFields(endpoint.fields, doc, doc('body'));

            if (endpoint.postProcessor) {
                results = endpoint.postProcessor(results, endpoint);
            }
        }

        return results;
    }
    protected analyzeFields(fields: any[], mainDoc: any, mainElement: any): any {
        let results: any = {};

        const parse = (field: any, element: any) => {
            let out: any = null;

            if (typeof field.fields !== 'undefined') {
                out = this.analyzeFields(field.fields, mainDoc, element);
            } else {
                out = this._parsers[field.parser](element, field.parserParams);
            }

            return out;
        }

        for (const field of fields) {
            const findings = mainElement.find(field.path);
            if (findings.length > 1) {
                results[field.name] = [];

                findings.each((index: number, element: any) => {
                    results[field.name].push(parse(field, mainDoc(element)));
                });
            } else {
                results[field.name] = parse(field, findings);
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

        const ppCheck: ToolsCheckPathResult = Tools.CheckFile(cachePath);
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

            let ppCheck: ToolsCheckPathResult = null;

            for (const endpoint of this._config.endpoints) {
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

                    if (!endpoint.cacheLifetime || endpoint.cacheLifetime < 0) {
                        endpoint.cacheLifetime = this._config.cacheLifetime;
                    }
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

            this._parsers['attr'] = WAParserAttribute;
            this._parsers['attribute'] = WAParserAttribute;
            this._parsers['number'] = WAParserNumber;
            this._parsers['text'] = WAParserText;
            this._parsers['trim-text'] = WAParserTrimText;
        }
    }
    protected loadConfig(): void {
        if (!this._loaded) {
            let ppCheck: ToolsCheckPathResult = Tools.CheckFile(this._configPath);
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
        const cachePath = this.getCachePath(key);
        fs.writeFileSync(`${cachePath}.${extension}`, data);
    }
    protected saveJSONCache(key: string, json: any) {
        this.saveCache(key, JSON.stringify(json), 'json');
    }
    protected saveRawCache(key: string, raw: string) {
        this.saveCache(key, raw, 'html');
    }
}
