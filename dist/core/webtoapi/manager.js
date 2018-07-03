"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const types_1 = require("./types");
const parsers_1 = require("./parsers");
const spec_config_1 = require("./spec.config");
const router_1 = require("./router");
class WebToApi {
    //
    // Constructor.
    constructor(config) {
        //
        // Protected properties.
        this._cachePath = null;
        this._config = null;
        this._endpoints = {};
        this._loaded = false;
        this._parsers = {};
        this._router = null;
        if (typeof config === 'string') {
            let stat = null;
            try {
                stat = libraries_1.fs.statSync(config);
            }
            catch (e) { }
            if (stat && stat.isFile()) {
                try {
                    this._config = JSON.parse(libraries_1.fs.readFileSync(config).toString());
                }
                catch (e) {
                    throw new types_1.WAException(`WebToApi::constructor() Error: Unable to load '${config}'. ${e}`);
                }
            }
            else if (stat && stat.isFile()) {
                throw new types_1.WAException(`WebToApi::constructor() Error: '${config}' is not a file.`);
            }
            else {
                throw new types_1.WAException(`WebToApi::constructor() Error: '${config}' doesn't exist.`);
            }
        }
        else {
            this._config = config;
        }
        this.load();
    }
    //
    // Public methods.
    has(type) {
        return typeof this._endpoints[type] !== 'undefined';
    }
    get(type, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = {};
            const key = this.genKey(type, params);
            if (this.has(type)) {
                const endpoint = this._endpoints[type];
                results = this.getCache(key);
                if (!results) {
                    let data = null;
                    switch (endpoint.method.toUpperCase()) {
                        case 'GET':
                        default:
                            try {
                                data = yield libraries_1.request.get(this.adaptUrl(endpoint.url, params));
                            }
                            catch (e) {
                                console.error(libraries_1.chalk.red(`Error: ${e}`));
                            }
                            break;
                    }
                    results = this.analyze(key, data, endpoint);
                    this.saveCache(key, data, results);
                }
            }
            else {
                throw new types_1.WAException(`Unknown type '${type}'`);
            }
            return results;
        });
    }
    router() {
        this.loadRouter();
        return this._router.expressRouter();
    }
    //
    // Protected methods.
    adaptUrl(url, params) {
        for (const k of Object.keys(params)) {
            const pat = new RegExp(`:${k}:`, 'g');
            url = url.replace(pat, params[k]);
        }
        return url;
    }
    analyze(key, data, endpoint) {
        let results = {};
        if (data) {
            const doc = libraries_1.cheerio.load(data, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            results = this.analyzeFields(endpoint.fields, doc, doc('body'));
        }
        return results;
    }
    analyzeFields(fields, mainDoc, mainElement) {
        let results = {};
        const parse = (field, element) => {
            let out = null;
            if (typeof field.fields !== 'undefined') {
                out = this.analyzeFields(field.fields, mainDoc, element);
            }
            else {
                out = this._parsers[field.parser](element, field.parserParams);
            }
            return out;
        };
        for (const field of fields) {
            const findings = mainElement.find(field.path);
            if (findings.length > 1) {
                results[field.name] = [];
                findings.each((index, element) => {
                    results[field.name].push(parse(field, mainDoc(element)));
                });
            }
            else {
                results[field.name] = parse(field, findings);
            }
        }
        return results;
    }
    genKey(type, params) {
        return libraries_1.md5(`[${type}][${JSON.stringify(params)}]`);
    }
    getCachePath(key) {
        return libraries_1.path.join(this._cachePath, `cache.${key}`);
    }
    getCache(key) {
        let results = null;
        const cachePath = `${this.getCachePath(key)}.json`;
        let stat = null;
        try {
            stat = libraries_1.fs.statSync(cachePath);
        }
        catch (e) { }
        if (stat && stat.isFile()) {
            try {
                results = JSON.parse(libraries_1.fs.readFileSync(cachePath).toString());
            }
            catch (e) { }
        }
        return results;
    }
    load() {
        if (!this._loaded) {
            this._loaded = true;
            let validator = null;
            try {
                const ajvObj = new libraries_1.ajv({
                    useDefaults: true
                });
                validator = ajvObj.compile(spec_config_1.WebToApiConfigSpec);
            }
            catch (e) {
                throw new types_1.WAException(`WebToApi::load(): ${e}`);
            }
            if (!validator(this._config)) {
                throw new types_1.WAException(`WebToApi::load(): Bad configuration. '\$${validator.errors[0].dataPath}' ${validator.errors[0].message}`);
            }
            for (const endpoint of this._config.endpoints) {
                this._endpoints[endpoint.name] = endpoint;
            }
            let stat = null;
            try {
                stat = libraries_1.fs.statSync(this._config.cachePath);
            }
            catch (e) { }
            if (stat && stat.isDirectory()) {
                this._cachePath = this._config.cachePath;
            }
            else if (stat && !stat.isDirectory()) {
                throw new types_1.WAException(`WebToApi::load(): '${this._config.cachePath}' is not a directory`);
            }
            else {
                throw new types_1.WAException(`WebToApi::load(): '${this._config.cachePath}' doesn't exist`);
            }
            this._parsers['attr'] = parsers_1.WAParserAttribute;
            this._parsers['attribute'] = parsers_1.WAParserAttribute;
            this._parsers['text'] = parsers_1.WAParserText;
            this._parsers['trim-text'] = parsers_1.WAParserTrimText;
        }
    }
    loadRouter() {
        if (!this._router) {
            this._router = new router_1.WebToApiRouter(this, this._endpoints, this._config);
        }
    }
    saveCache(key, raw, json) {
        const cachePath = this.getCachePath(key);
        libraries_1.fs.writeFileSync(`${cachePath}.raw`, raw);
        libraries_1.fs.writeFileSync(`${cachePath}.json`, JSON.stringify(json));
    }
}
exports.WebToApi = WebToApi;
