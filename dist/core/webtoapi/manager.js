"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const types_1 = require("./types");
const parsers_1 = require("./parsers");
const rules_1 = require("./rules");
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
        this._rules = {};
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
    async get(type, params) {
        let results = {};
        const key = this.genKey(type, params);
        if (this.has(type)) {
            const endpoint = this._endpoints[type];
            let preRequest = new pre_processor_data_1.WAPreProcessorData();
            preRequest.headers = includes_1.Tools.DeepCopy(endpoint.headers);
            preRequest.endpoint = endpoint;
            preRequest.params = params;
            if (endpoint.preProcessor) {
                preRequest = await endpoint.preProcessor(preRequest);
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
                                raw = await libraries_1.request.get(options);
                            }
                            catch (he) {
                                throw new types_1.WAException(`${he.name}: Code: ${he.statusCode}. Url: ${options.url}`);
                            }
                            break;
                    }
                }
                catch (err) {
                    console.error(libraries_1.chalk.red(`Error: `), err);
                }
                this.saveRawCache(key, raw);
            }
            results = reAnalyze ? null : this.getJSONCache(key, endpoint.cacheLifetime);
            if (!results || preRequest.forceAnalysis) {
                results = await this.analyze(key, raw, endpoint, preRequest);
                this.saveJSONCache(key, results);
            }
        }
        else {
            throw new types_1.WAException(`Unknown type '${type}'`);
        }
        return results;
    }
    has(type) {
        return typeof this._endpoints[type] !== 'undefined';
    }
    koaRouter() {
        this.loadRouter();
        return this._router.koaRouter();
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
    async analyze(key, data, endpoint, preRequest) {
        let results = {};
        if (data) {
            const doc = libraries_1.cheerio.load(data, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            results = await this.analyzeFields(endpoint.fields, doc, doc(endpoint.mainSelector));
            results = await this.applyRules(endpoint.rules, results);
            if (endpoint.postProcessor) {
                let requestData = new post_processor_data_1.WAPostProcessorData();
                requestData.data = results;
                requestData.endpoint = endpoint;
                requestData.request = preRequest;
                requestData = await endpoint.postProcessor(requestData);
                results = requestData.data;
            }
        }
        return results;
    }
    async analyzeFields(fields, mainDoc, mainElement) {
        let results = {};
        const parse = async (field, element) => {
            let out = null;
            if (typeof field.fields !== 'undefined') {
                out = await this.analyzeFields(field.fields, mainDoc, element);
            }
            else {
                out = await this._parsers[field.parser](element, field.parserParams);
            }
            return out;
        };
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
                    let aux = await parse(field, mainDoc(element));
                    results[field.name].push(aux);
                }
                // @}
                if (field.index !== null && results[field.name].length > 0) {
                    results[field.name] = results[field.name][0];
                }
            }
            else {
                results[field.name] = await parse(field, findings);
            }
            if (findings.length > 0 && field.forceArray) {
                if (!Array.isArray(results[field.name])) {
                    if (results[field.name] !== null) {
                        results[field.name] = [results[field.name]];
                    }
                    else {
                        results[field.name] = [];
                    }
                }
            }
            results[field.name] = await this.applyRules(field.rules, results[field.name]);
        }
        return results;
    }
    async applyRules(rules, root) {
        for (const rule of rules) {
            if (typeof this._rules[rule.type] !== 'undefined') {
                root = await this._rules[rule.type](rule, root);
            }
        }
        return root;
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
                if (includes_1.Tools.FullErrors()) {
                    for (const error of validator.errors) {
                        console.log(libraries_1.chalk.red(`WebToApi::load() Error:`));
                        console.log(libraries_1.chalk.red(`WebToApi::load():    \$${error.dataPath}`));
                        console.log(libraries_1.chalk.red(`WebToApi::load():    ${error.message}`));
                    }
                }
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
                this._parsers['anchor'] = parsers_1.WAParserAnchor;
                this._parsers['anchor-full'] = parsers_1.WAParserAnchorFull;
                this._parsers['attr'] = parsers_1.WAParserAttribute;
                this._parsers['attribute'] = parsers_1.WAParserAttribute;
                this._parsers['html'] = parsers_1.WAParserHtml;
                this._parsers['ld-json'] = parsers_1.WAParserLDJson;
                this._parsers['number'] = parsers_1.WAParserNumber;
                this._parsers['text'] = parsers_1.WAParserText;
                this._parsers['trim-text'] = parsers_1.WAParserTrimText;
                this._rules['append'] = rules_1.WARuleAppend;
                this._rules['combine'] = rules_1.WARuleCombine;
                this._rules['copy'] = rules_1.WARuleCopy;
                this._rules['forget'] = rules_1.WARuleForget;
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
