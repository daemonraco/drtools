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
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const types_1 = require("./types");
const parsers_1 = require("./parsers");
const spec_config_1 = require("./spec.config");
const router_1 = require("./router");
const post_processor_data_1 = require("./post-processor-data");
const pre_processor_data_1 = require("./pre-processor-data");
class WebToApi {
    //
    // Constructor.
    constructor(configPath) {
        //
        // Protected properties.
        this._cachePath = null;
        this._config = null;
        this._configPath = null;
        this._customParsers = [];
        this._endpoints = {};
        this._loaded = false;
        this._parsers = {};
        this._relativePath = null;
        this._router = null;
        this._configPath = configPath;
        this.loadConfig();
        this.load();
        drcollector_1.DRCollector.registerWebToApiManager(this);
    }
    //
    // Public methods.
    cacheLifetime() {
        return this._config ? this._config.cacheLifetime : 300;
    }
    cachePath() {
        return this._cachePath;
    }
    configPath() {
        return this._configPath;
    }
    customParsers() {
        return includes_1.Tools.DeepCopy(this._customParsers);
    }
    description() {
        return this._config ? this._config.description : '';
    }
    endpoints() {
        return this._endpoints;
    }
    has(type) {
        return typeof this._endpoints[type] !== 'undefined';
    }
    get(type, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = {};
            const key = this.genKey(type, params);
            if (this.has(type)) {
                const endpoint = this._endpoints[type];
                let preRequest = new pre_processor_data_1.WAPreProcessorData();
                preRequest.headers = includes_1.Tools.DeepCopy(endpoint.headers);
                preRequest.endpoint = endpoint;
                preRequest.params = params;
                if (endpoint.preProcessor) {
                    preRequest = yield endpoint.preProcessor(preRequest);
                }
                if (preRequest.forceDownloading) {
                    preRequest.forceAnalysis = true;
                }
                let reAnalyze = false;
                let raw = this.getRawCache(key, endpoint.cacheLifetime);
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
                                    raw = yield libraries_1.request.get(options);
                                }
                                catch (he) {
                                    throw new types_1.WAException(`${he.name}: Code: ${he.statusCode}. Url: ${options.url}`);
                                }
                                break;
                        }
                    }
                    catch (e) {
                        console.error(libraries_1.chalk.red(`Error: ${e}`));
                    }
                    this.saveRawCache(key, raw);
                }
                results = reAnalyze ? null : this.getJSONCache(key, endpoint.cacheLifetime);
                if (!results || preRequest.forceAnalysis) {
                    results = yield this.analyze(key, raw, endpoint);
                    this.saveJSONCache(key, results);
                }
            }
            else {
                throw new types_1.WAException(`Unknown type '${type}'`);
            }
            return results;
        });
    }
    matchesKey(key) {
        return this._config && this._config.key === key;
    }
    name() {
        return this._config ? this._config.name : '';
    }
    parsers() {
        return Object.keys(this._parsers);
    }
    relativePath() {
        return this._relativePath;
    }
    routes() {
        return this._config ? this._config.routes : [];
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
        return __awaiter(this, void 0, void 0, function* () {
            let results = {};
            if (data) {
                const doc = libraries_1.cheerio.load(data, {
                    normalizeWhitespace: true,
                    xmlMode: true
                });
                results = yield this.analyzeFields(endpoint.fields, doc, doc('body'));
                if (endpoint.postProcessor) {
                    let requestData = new post_processor_data_1.WAPostProcessorData();
                    requestData.data = results;
                    requestData.endpoint = endpoint;
                    requestData = yield endpoint.postProcessor(requestData);
                    results = requestData.data;
                }
            }
            return results;
        });
    }
    analyzeFields(fields, mainDoc, mainElement) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = {};
            const parse = (field, element) => __awaiter(this, void 0, void 0, function* () {
                let out = null;
                if (typeof field.fields !== 'undefined') {
                    out = yield this.analyzeFields(field.fields, mainDoc, element);
                }
                else {
                    out = yield this._parsers[field.parser](element, field.parserParams);
                }
                return out;
            });
            for (const field of fields) {
                const findings = mainElement.find(field.path);
                if (findings.length > 1) {
                    results[field.name] = [];
                    //
                    // Why a copy to a list and two fors? well each doesn't seem to
                    // allow async/await @{
                    const elements = [];
                    findings.each((index, element) => {
                        if (field.index === null || field.index === index) {
                            elements.push(element);
                        }
                    });
                    for (const element of elements) {
                        let aux = yield parse(field, mainDoc(element));
                        results[field.name].push(aux);
                    }
                    // @}
                    if (field.index !== null && results[field.name].length > 0) {
                        results[field.name] = results[field.name][0];
                    }
                }
                else {
                    results[field.name] = yield parse(field, findings);
                }
            }
            return results;
        });
    }
    genKey(type, params) {
        return libraries_1.md5(`[${type}][${JSON.stringify(params)}]`);
    }
    getCachePath(key) {
        return libraries_1.path.join(this._cachePath, `cache.${key}`);
    }
    getCache(key, extension, lifetime) {
        let results = null;
        const cachePath = `${this.getCachePath(key)}.${extension}`;
        const ppCheck = includes_1.Tools.CheckFile(cachePath);
        if (ppCheck.status === includes_1.ToolsCheckPath.Ok) {
            if ((Date.now() - Math.floor(ppCheck.stat.mtimeMs)) < (lifetime * 1000)) {
                try {
                    results = libraries_1.fs.readFileSync(cachePath).toString();
                }
                catch (e) { }
            }
        }
        return results;
    }
    getJSONCache(key, lifetime) {
        let results = null;
        try {
            results = JSON.parse(this.getCache(key, 'json', lifetime));
        }
        catch (e) { }
        return results;
    }
    getRawCache(key, lifetime) {
        return this.getCache(key, 'html', lifetime);
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
            if (typeof this._config.name === 'undefined') {
                this._config.name = libraries_1.path.basename(this._configPath);
            }
            let ppCheck = null;
            for (const endpoint of this._config.endpoints) {
                if (endpoint.preProcessor) {
                    ppCheck = includes_1.Tools.CheckFile(endpoint.preProcessor, this._relativePath);
                    switch (ppCheck.status) {
                        case includes_1.ToolsCheckPath.Ok:
                            try {
                                endpoint.preProcessorPath = ppCheck.path;
                                endpoint.preProcessor = require(ppCheck.path);
                            }
                            catch (e) {
                                throw new types_1.WAException(`WebToApi::load(): Unable to load '${endpoint.preProcessor}'. ${e}`);
                            }
                            break;
                        case includes_1.ToolsCheckPath.WrongType:
                            throw new types_1.WAException(`WebToApi::load(): '${endpoint.preProcessor}' is not a file`);
                        default:
                            throw new types_1.WAException(`WebToApi::load(): '${endpoint.preProcessor}' doesn't exist`);
                    }
                }
                if (endpoint.postProcessor) {
                    ppCheck = includes_1.Tools.CheckFile(endpoint.postProcessor, this._relativePath);
                    switch (ppCheck.status) {
                        case includes_1.ToolsCheckPath.Ok:
                            try {
                                endpoint.postProcessorPath = ppCheck.path;
                                endpoint.postProcessor = require(ppCheck.path);
                            }
                            catch (e) {
                                throw new types_1.WAException(`WebToApi::load(): Unable to load '${endpoint.postProcessor}'. ${e}`);
                            }
                            break;
                        case includes_1.ToolsCheckPath.WrongType:
                            throw new types_1.WAException(`WebToApi::load(): '${endpoint.postProcessor}' is not a file`);
                        default:
                            throw new types_1.WAException(`WebToApi::load(): '${endpoint.postProcessor}' doesn't exist`);
                    }
                }
                this._parsers['attr'] = parsers_1.WAParserAttribute;
                this._parsers['attribute'] = parsers_1.WAParserAttribute;
                this._parsers['html'] = parsers_1.WAParserHtml;
                this._parsers['number'] = parsers_1.WAParserNumber;
                this._parsers['text'] = parsers_1.WAParserText;
                this._parsers['trim-text'] = parsers_1.WAParserTrimText;
                for (const parser of this._config.parsers) {
                    ppCheck = includes_1.Tools.CheckFile(parser.path, this._relativePath);
                    switch (ppCheck.status) {
                        case includes_1.ToolsCheckPath.Ok:
                            try {
                                this._parsers[parser.code] = require(ppCheck.path);
                                this._customParsers.push({
                                    code: parser.code,
                                    path: ppCheck.path
                                });
                            }
                            catch (e) {
                                throw new types_1.WAException(`WebToApi::load(): Unable to load '${parser.path}'. ${e}`);
                            }
                            break;
                        case includes_1.ToolsCheckPath.WrongType:
                            throw new types_1.WAException(`WebToApi::load(): '${parser.path}' is not a file`);
                        default:
                            throw new types_1.WAException(`WebToApi::load(): '${parser.path}' doesn't exist`);
                    }
                }
                if (typeof endpoint.cacheLifetime === 'undefined' || endpoint.cacheLifetime < 0) {
                    endpoint.cacheLifetime = this._config.cacheLifetime;
                }
                this._endpoints[endpoint.name] = endpoint;
            }
            ppCheck = includes_1.Tools.CheckDirectory(this._config.cachePath, this._relativePath);
            switch (ppCheck.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._cachePath = ppCheck.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    throw new types_1.WAException(`WebToApi::load(): '${this._config.cachePath}' is not a directory`);
                default:
                    throw new types_1.WAException(`WebToApi::load(): '${this._config.cachePath}' doesn't exist`);
            }
        }
    }
    loadConfig() {
        if (!this._loaded) {
            let ppCheck = includes_1.Tools.CheckFile(this._configPath);
            switch (ppCheck.status) {
                case includes_1.ToolsCheckPath.Ok:
                    try {
                        this._config = JSON.parse(libraries_1.fs.readFileSync(ppCheck.path).toString());
                    }
                    catch (e) {
                        throw new types_1.WAException(`WebToApi::loadConfig() Error: Unable to load '${this._configPath}'. ${e}`);
                    }
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    throw new types_1.WAException(`WebToApi::loadConfig() Error: '${this._configPath}' is not a file.`);
                default:
                    throw new types_1.WAException(`WebToApi::loadConfig() Error: '${this._configPath}' doesn't exist.`);
            }
            this._relativePath = libraries_1.path.dirname(libraries_1.path.resolve(this._configPath));
        }
    }
    loadRouter() {
        if (!this._router) {
            this._router = new router_1.WebToApiRouter(this, this._endpoints, this._config);
        }
    }
    saveCache(key, data, extension) {
        if (data) {
            const cachePath = this.getCachePath(key);
            libraries_1.fs.writeFileSync(`${cachePath}.${extension}`, data);
        }
    }
    saveJSONCache(key, json) {
        this.saveCache(key, json ? JSON.stringify(json) : json, 'json');
    }
    saveRawCache(key, raw) {
        this.saveCache(key, raw, 'html');
    }
}
exports.WebToApi = WebToApi;
