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

            results = this.getCache(key);
            if (!results) {
                let data = null;
                switch (endpoint.method.toUpperCase()) {
                    case 'GET':
                    default:
                        try {
                            data = await request.get(this.adaptUrl(endpoint.url, params));
                        } catch (e) {
                            console.error(chalk.red(`Error: ${e}`));
                        }
                        break;
                }

                results = this.analyze(key, data, endpoint);
                this.saveCache(key, data, results);
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
                results = endpoint.postProcessor(results);
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
    protected getCache(key: string): any {
        let results: any = null;
        const cachePath: string = `${this.getCachePath(key)}.json`;

        const ppCheck: ToolsCheckPathResult = Tools.CheckFile(cachePath);
        if (ppCheck.status === ToolsCheckPath.Ok) {
            try {
                results = JSON.parse(fs.readFileSync(cachePath).toString());
            } catch (e) { }
        }

        return results;
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
    protected saveCache(key: string, raw: string, json: any) {
        const cachePath = this.getCachePath(key);

        fs.writeFileSync(`${cachePath}.raw`, raw);
        fs.writeFileSync(`${cachePath}.json`, JSON.stringify(json));
    }
}
