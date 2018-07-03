/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { ajv, chalk, cheerio, fs, md5, request, path } from '../../libraries';

import { WAEndpoint, WAEndpointList, WAException, WAParsersList, WAUrlParameters } from './types';
import { WAParserAttribute, WAParserText, WAParserTrimText } from './parsers';
import { WebToApiConfigSpec } from './spec.config';
import { WebToApiRouter } from './router';

export class WebToApi {
    //
    // Protected properties.
    protected _cachePath: string = null;
    protected _config: any = null;
    protected _endpoints: WAEndpointList = {};
    protected _loaded: boolean = false;
    protected _parsers: WAParsersList = {};
    protected _router: WebToApiRouter = null;
    //
    // Constructor.
    public constructor(config: string | any) {
        if (typeof config === 'string') {
            let stat = null;
            try { stat = fs.statSync(config); } catch (e) { }
            if (stat && stat.isFile()) {
                try {
                    this._config = JSON.parse(fs.readFileSync(config).toString());
                } catch (e) {
                    throw new WAException(`WebToApi::constructor() Error: Unable to load '${config}'. ${e}`);
                }
            } else if (stat && stat.isFile()) {
                throw new WAException(`WebToApi::constructor() Error: '${config}' is not a file.`);
            } else {
                throw new WAException(`WebToApi::constructor() Error: '${config}' doesn't exist.`);
            }
        } else {
            this._config = config;
        }

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
        let results = null;

        const cachePath = `${this.getCachePath(key)}.json`;
        let stat = null;
        try { stat = fs.statSync(cachePath); } catch (e) { }
        if (stat && stat.isFile()) {
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

            for (const endpoint of this._config.endpoints) {
                this._endpoints[endpoint.name] = endpoint;
            }

            let stat = null;
            try { stat = fs.statSync(this._config.cachePath); } catch (e) { }
            if (stat && stat.isDirectory()) {
                this._cachePath = this._config.cachePath;
            } else if (stat && !stat.isDirectory()) {
                throw new WAException(`WebToApi::load(): '${this._config.cachePath}' is not a directory`);
            } else {
                throw new WAException(`WebToApi::load(): '${this._config.cachePath}' doesn't exist`);
            }

            this._parsers['attr'] = WAParserAttribute;
            this._parsers['attribute'] = WAParserAttribute;
            this._parsers['text'] = WAParserText;
            this._parsers['trim-text'] = WAParserTrimText;
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
