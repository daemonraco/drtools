"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigsManager = void 0;
const libraries_1 = require("../../libraries");
const _1 = require(".");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const md5 = require("md5");
var PublishExportsTypes;
(function (PublishExportsTypes) {
    PublishExportsTypes["Express"] = "express";
    PublishExportsTypes["Koa"] = "koa";
})(PublishExportsTypes || (PublishExportsTypes = {}));
;
const ENV_PATTERN = /^ENV:(.+)$/;
class ConfigsManager {
    //
    // Constructor.
    constructor(directory, options = {}) {
        //
        // Protected properties.
        this._directories = [];
        this._environmentName = null;
        this._exports = {};
        this._items = {};
        this._key = '';
        this._lastError = null;
        this._options = null;
        this._publicUri = null;
        // protected _specItems: IConfigSpecItem[] = [];
        this._specs = {};
        this._specsDirectories = [];
        this._valid = false;
        this._options = options;
        this.cleanOptions();
        this._directories = Array.isArray(directory) ? directory : [directory];
        this._specsDirectories = this._options.specs
            ? Array.isArray(this._options.specs) ? this._options.specs : [this._options.specs]
            : [];
        this.load();
        drcollector_1.DRCollector.registerConfigsManager(this);
    }
    //
    // Public methods.
    directories() {
        return this._directories;
    }
    environmentName() {
        return this._environmentName;
    }
    get(name) {
        return this._items[name] !== undefined ? this._items[name].data : {};
    }
    getSpecs(name) {
        return this._specs[name] !== undefined ? this._specs[name].specs : null;
    }
    items() {
        return this._items;
    }
    itemNames() {
        return Object.keys(this._items);
    }
    key() {
        return this._key;
    }
    lastError() {
        return this._lastError;
    }
    matchesKey(key) {
        return this._key === key;
    }
    options() {
        return includes_1.Tools.DeepCopy(this._options);
    }
    publicItemNames() {
        return Object.keys(this._exports);
    }
    publishExports(uri = _1.ConfigsConstants.PublishUri) {
        return this.genericPublishExports(PublishExportsTypes.Express, uri);
    }
    publishExportsForKoa(uri = _1.ConfigsConstants.PublishUri) {
        return this.genericPublishExports(PublishExportsTypes.Koa, uri);
    }
    publicUri() {
        return this._publicUri;
    }
    specs() {
        return this._specs;
    }
    specsDirectories() {
        return this._specsDirectories;
    }
    specsSuffix() {
        return this._options.specsSuffix;
    }
    suffix() {
        return this._options.suffix;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    cleanOptions() {
        let defaultOptions = {
            environmentVariable: false,
            key: undefined,
            specs: undefined,
            specsSuffix: _1.ConfigsConstants.SpecsSuffix,
            suffix: _1.ConfigsConstants.Suffix,
            verbose: true,
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    /* istanbul ignore next */
    expandEnvVariablesIn(data) {
        switch (typeof data) {
            case 'string':
                const match = data.match(ENV_PATTERN);
                if (match) {
                    data = process.env[match[1]];
                }
                break;
            case 'object':
                if (Array.isArray(data)) {
                    for (const idx in data) {
                        data[idx] = this.expandEnvVariablesIn(data[idx]);
                    }
                }
                else if (data) {
                    for (const key of Object.keys(data)) {
                        data[key] = this.expandEnvVariablesIn(data[key]);
                    }
                }
                break;
        }
        return data;
    }
    /* istanbul ignore next */
    genericPublishExports(type, uri = _1.ConfigsConstants.PublishUri) {
        //
        // Cleaning URI @{
        this._publicUri = `/${uri}/`;
        [
            ['//', '/']
        ].forEach((pair) => {
            while (this._publicUri.indexOf(pair[0]) > -1) {
                this._publicUri = this._publicUri.replace(pair[0], pair[1]);
            }
        });
        this._publicUri = this._publicUri.substr(0, this._publicUri.length - 1);
        const uriForPattern = this._publicUri.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}
        const pattern = new RegExp(`^${uriForPattern}([\\/]?)(.*)$`);
        let middlewareResult = null;
        switch (type) {
            case PublishExportsTypes.Express:
                middlewareResult = (req, res, next) => {
                    let responded = false;
                    if (req.originalUrl.match(pattern)) {
                        const name = req.originalUrl.replace(pattern, '$2');
                        if (name) {
                            if (this._exports[name] !== undefined) {
                                res.json(this._exports[name]);
                            }
                            else {
                                res.status(libraries_1.httpStatusCodes.NOT_FOUND).json({
                                    error: true,
                                    message: `Unknown exported configuration '${name}'.`
                                });
                            }
                        }
                        else {
                            res.json({
                                configs: Object.keys(this._exports)
                            });
                        }
                        responded = true;
                    }
                    if (!responded) {
                        next();
                    }
                };
                break;
            case PublishExportsTypes.Koa:
                middlewareResult = async (ctx, next) => {
                    let responded = false;
                    if (ctx.originalUrl.match(pattern)) {
                        const name = ctx.originalUrl.replace(pattern, '$2');
                        if (name) {
                            if (this._exports[name] !== undefined) {
                                ctx.body = this._exports[name];
                            }
                            else {
                                ctx.throw(libraries_1.httpStatusCodes.NOT_FOUND, {
                                    error: true,
                                    message: `Unknown exported configuration '${name}'.`
                                });
                            }
                        }
                        else {
                            ctx.body = {
                                configs: Object.keys(this._exports),
                            };
                        }
                        responded = true;
                    }
                    if (!responded) {
                        await next();
                    }
                };
                break;
        }
        return middlewareResult;
    }
    /* istanbul ignore next */
    load() {
        this._lastError = null;
        //
        // Generating a unique key for this manager.
        this._key = this._options.key ? this._options.key : md5(JSON.stringify(this._directories));
        //
        // Loading environment names.
        this._environmentName = process.env.NODE_ENV || process.env.ENV_NAME || global.NODE_ENV || global.ENV_NAME || 'default';
        //
        // Checking given directory path.
        for (let i = 0; i < this._directories.length; i++) {
            if (this._lastError) {
                break;
            }
            const check = includes_1.Tools.CheckDirectory(this._directories[i], process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._directories[i] = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directories[i]}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._directories[i]}' does not exist.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
            }
        }
        //
        // Checking specs directory.
        for (let i = 0; i < this._specsDirectories.length; i++) {
            if (this._lastError) {
                break;
            }
            const check = includes_1.Tools.CheckDirectory(this._specsDirectories[i], process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._specsDirectories[i] = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${this._specsDirectories[i]}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._specsDirectories[i]}' does not exist.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
            }
        }
        if (!this._lastError) {
            //
            // Basic patterns.
            const configPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const configSpecPattern = new RegExp(`^(.*)\\.${this._options.specsSuffix}\\.(json|js)$`);
            const envPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading specs files.
            this._specs = {};
            for (const directory of this._specsDirectories) {
                for (const p of libraries_1.fs.readdirSync(directory).filter((x) => x.match(configSpecPattern))) {
                    const name = p.replace(configSpecPattern, '$1');
                    this._specs[name] = {
                        name,
                        path: libraries_1.path.resolve(libraries_1.path.join(directory, p)),
                        valid: false,
                    };
                }
            }
            //
            // Loading basic configuration files.
            this._items = {};
            for (const directory of this._directories) {
                for (const p of libraries_1.fs.readdirSync(directory).filter((x) => x.match(configPattern))) {
                    const name = p.replace(configPattern, '$1');
                    this._items[name] = {
                        name,
                        path: libraries_1.path.resolve(libraries_1.path.join(directory, p)),
                        data: null,
                        valid: false,
                    };
                }
            }
            //
            // Loading environment specific configuration files.
            for (const directory of this._directories) {
                for (const x of libraries_1.fs.readdirSync(directory).filter((x) => x.match(envPattern))) {
                    const name = x.replace(envPattern, '$1');
                    if (this._items[name] !== undefined) {
                        this._items[name].specific = {
                            name,
                            path: libraries_1.path.resolve(libraries_1.path.join(directory, x)),
                        };
                    }
                }
            }
        }
        this._exports = {};
        if (!this._lastError) {
            //
            // Loading specs.
            if (this._options.verbose) {
                console.log(`Loading config specs:`);
            }
            for (const name of Object.keys(this._specs)) {
                this._specs[name].valid = true;
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(name)}'`);
                    }
                    //
                    // Loading basic configuration.
                    try {
                        this._specs[name].specs = require(this._specs[name].path);
                    }
                    catch (e) {
                        this._lastError = `'${this._specs[name].path}' is not valid specification file. ${e}`;
                        console.error(libraries_1.chalk.red(this._lastError));
                        this._specs[name].valid = false;
                    }
                    //
                    // Creating a validator.
                    try {
                        const ajvObj = new libraries_1.ajv({ useDefaults: true });
                        this._specs[name].validator = ajvObj.compile(this._specs[name].specs);
                    }
                    catch (e) {
                        this._lastError = `Unable to compile '${this._specs[name].path}'. ${e}`;
                        console.error(libraries_1.chalk.red(this._lastError));
                        this._specs[name].valid = false;
                    }
                }
                catch (err) {
                    console.error(libraries_1.chalk.red(`Unable to load config '${name}'.`), err);
                }
            }
            //
            // Loading configurations.
            if (this._options.verbose) {
                console.log(`Loading configs (environment: ${libraries_1.chalk.green(this._environmentName)}):`);
            }
            for (const itemKey of Object.keys(this._items)) {
                let name = this._items[itemKey].name;
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(name)}'${this._items[itemKey].specific ? ` (has specific configuration)` : ''}`);
                    }
                    //
                    // Loading basic configuration.
                    this._items[itemKey].data = require(this._items[itemKey].path);
                    //
                    // Merging with the environment specific configuration.
                    if (this._items[itemKey].specific) {
                        this._items[itemKey].data = includes_1.Tools.DeepMergeObjects(this._items[itemKey].data, require(this._items[itemKey].specific.path));
                    }
                    //
                    // If there were no errors validating the config file, it can
                    // expose exports.
                    if (this.validateSpecsOf(name)) {
                        if (this._options.environmentVariable) {
                            this._items[itemKey].data = this.expandEnvVariablesIn(this._items[itemKey].data);
                        }
                        this._items[itemKey].public = this.loadExportsOf(name);
                    }
                    else {
                        this._items[itemKey].valid = false;
                    }
                }
                catch (err) {
                    console.error(libraries_1.chalk.red(`Unable to load config '${name}'.`), err);
                }
            }
        }
        this._valid = !this._lastError;
    }
    /* istanbul ignore next */
    loadExportsOf(name) {
        let hasExports = false;
        const config = this._items[name].data;
        if (config.$exports !== undefined || config.$pathExports !== undefined) {
            this._exports[name] = {};
        }
        if (config.$exports !== undefined) {
            this._exports[name] = includes_1.Tools.DeepMergeObjects(this._exports[name], config.$exports);
            hasExports = true;
        }
        if (config.$pathExports !== undefined) {
            for (let k in config.$pathExports) {
                const results = libraries_1.jsonpath({
                    path: config.$pathExports[k],
                    json: config
                });
                this._exports[name][k] = null;
                if (results.length == 1) {
                    this._exports[name][k] = results[0];
                }
                else if (results.length > 1) {
                    this._exports[name][k] = results;
                }
                hasExports = true;
            }
        }
        return hasExports;
    }
    /* istanbul ignore next */
    loadSpecsOf(name) {
        let specsPath = null;
        for (const specsDirectory of this._specsDirectories) {
            const tmpSpecsPath = libraries_1.path.join(specsDirectory, `${name}.json`);
            const check = includes_1.Tools.CheckFile(tmpSpecsPath);
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    specsPath = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${tmpSpecsPath}' is not a file.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                default:
                    specsPath = null;
                    break;
            }
        }
        return specsPath;
    }
    /* istanbul ignore next */
    validateSpecsOf(name) {
        let valid = false;
        if (this._specs[name] && this._specs[name].valid) {
            try {
                if (!this._specs[name].validator(this._items[name].data)) {
                    throw `'\$${this._specs[name].validator.errors[0].dataPath}' ${this._specs[name].validator.errors[0].message}`;
                }
                else {
                    valid = true;
                }
            }
            catch (e) {
                console.error(libraries_1.chalk.red(`Config '${name}' is not valid.\n\t${e}`));
            }
        }
        else {
            valid = true;
        }
        return valid;
    }
}
exports.ConfigsManager = ConfigsManager;
