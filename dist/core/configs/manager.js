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
const jsonpath = require('jsonpath-plus');
const libraries_1 = require("../../libraries");
const _1 = require(".");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
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
        this._configs = {};
        this._directory = null;
        this._environmentName = null;
        this._items = [];
        this._exports = {};
        this._lastError = null;
        this._options = null;
        this._specs = {};
        this._specsDirectory = null;
        this._publicUri = null;
        this._valid = false;
        this._directory = directory;
        this._specsDirectory = libraries_1.path.join(directory, _1.ConfigsConstants.SpecsDirectory);
        this._options = options;
        this.cleanOptions();
        this.load();
        drcollector_1.DRCollector.registerConfigsManager(this);
    }
    //
    // Public methods.
    directory() {
        return this._directory;
    }
    environmentName() {
        return this._environmentName;
    }
    get(name) {
        return this._configs[name] !== undefined ? this._configs[name] : {};
    }
    getSpecs(name) {
        return this._specs[name] !== undefined ? this._specs[name] : null;
    }
    items() {
        return this._items;
    }
    itemNames() {
        return this._items.map((i) => i.name);
    }
    lastError() {
        return this._lastError;
    }
    matchesKey(key) {
        return this.directory() === key;
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
    specsDirectory() {
        return this._specsDirectory;
    }
    suffix() {
        return this._options.suffix;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            environmentVariable: false,
            suffix: _1.ConfigsConstants.Suffix,
            verbose: true,
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
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
                middlewareResult = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
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
                        yield next();
                    }
                });
                break;
        }
        return middlewareResult;
    }
    load() {
        this._lastError = null;
        //
        // Loading environment names.
        this._environmentName = process.env.NODE_ENV || process.env.ENV_NAME || global.NODE_ENV || global.ENV_NAME || 'default';
        if (this._options.verbose) {
            console.log(`Loading configs (environment: ${libraries_1.chalk.green(this._environmentName)}):`);
        }
        //
        // Checking given directory path.
        if (!this._lastError) {
            const check = includes_1.Tools.CheckDirectory(this._directory, process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._directory = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directory}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._directory}' does not exist.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
            }
        }
        //
        // Checking specs directory.
        if (!this._lastError) {
            const check = includes_1.Tools.CheckDirectory(this._specsDirectory, process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._specsDirectory = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${this._specsDirectory}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                default:
                    this._specsDirectory = null;
                    break;
            }
        }
        if (!this._lastError) {
            //
            // Basic patterns.
            const configPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const envPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading basic configuration files.
            this._items = libraries_1.fs.readdirSync(this._directory)
                .filter((x) => x.match(configPattern))
                .map((x) => ({
                name: x.replace(configPattern, '$1'),
                path: libraries_1.path.resolve(libraries_1.path.join(this._directory, x))
            }));
            //
            // Loading evironment specific configuration files.
            const envFiles = libraries_1.fs.readdirSync(this._directory)
                .filter((x) => x.match(envPattern))
                .map((x) => ({
                name: x.replace(envPattern, '$1'),
                path: libraries_1.path.resolve(libraries_1.path.join(this._directory, x))
            }));
            //
            // Merging lists.
            for (let i in this._items) {
                for (let j in envFiles) {
                    if (this._items[i].name === envFiles[j].name) {
                        this._items[i].specific = envFiles[j];
                        break;
                    }
                }
            }
        }
        this._configs = {};
        this._exports = {};
        if (!this._lastError) {
            for (const item of this._items) {
                let valid = true;
                let name = item.name;
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(name)}'${item.specific ? ` (has specific configuration)` : ''}`);
                    }
                    //
                    // Loading basic configuration.
                    this._configs[name] = require(item.path);
                    //
                    // Merging with the environment specific configuration.
                    if (item.specific) {
                        this._configs[name] = includes_1.Tools.DeepMergeObjects(this._configs[name], require(item.specific.path));
                    }
                    //
                    // Does it have specs?
                    this._configs[name].specsPath = null;
                    if (this._specsDirectory) {
                        this._configs[name].specsPath = this.loadSpecsOf(name);
                        if (this._configs[name].specsPath !== null) {
                            valid = this.validateSpecsOf(name, this._configs[name].specsPath);
                        }
                    }
                    //
                    // If there were no errors validating the config file, it can
                    // expose exports.
                    if (valid) {
                        if (this._options.environmentVariable) {
                            this._configs[name] = this.expandEnvVariablesIn(this._configs[name]);
                        }
                        this._configs[name].public = this.loadExportsOf(name);
                    }
                    else {
                        this._configs[name] = {};
                    }
                }
                catch (err) {
                    console.error(libraries_1.chalk.red(`Unable to load config '${name}'.`), err);
                }
            }
        }
        this._valid = !this._lastError;
    }
    loadExportsOf(name) {
        let hasExports = false;
        const config = this._configs[name];
        if (config.$exports !== undefined || config.$pathExports !== undefined) {
            this._exports[name] = {};
        }
        if (config.$exports !== undefined) {
            this._exports[name] = includes_1.Tools.DeepMergeObjects(this._exports[name], config.$exports);
            hasExports = true;
        }
        if (config.$pathExports !== undefined) {
            for (let k in config.$pathExports) {
                const results = jsonpath({
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
    loadSpecsOf(name) {
        let specsPath = libraries_1.path.join(this._specsDirectory, `${name}.json`);
        const check = includes_1.Tools.CheckFile(specsPath);
        switch (check.status) {
            case includes_1.ToolsCheckPath.Ok:
                specsPath = check.path;
                break;
            case includes_1.ToolsCheckPath.WrongType:
                this._lastError = `'${specsPath}' is not a file.`;
                console.error(libraries_1.chalk.red(this._lastError));
                break;
            default:
                specsPath = null;
                break;
        }
        return specsPath;
    }
    validateSpecsOf(name, specsPath) {
        let valid = false;
        this._specs[name] = null;
        try {
            this._specs[name] = require(specsPath);
        }
        catch (e) {
            this._lastError = `'${this._directory}' is not valid specification file. ${e}`;
            console.error(libraries_1.chalk.red(this._lastError));
        }
        //
        // Creating a validator.
        try {
            const ajvObj = new libraries_1.ajv({
                useDefaults: true
            });
            const validator = ajvObj.compile(this._specs[name]);
            if (!validator(this._configs[name])) {
                throw `'\$${validator.errors[0].dataPath}' ${validator.errors[0].message}`;
            }
            else {
                valid = true;
            }
        }
        catch (e) {
            console.error(libraries_1.chalk.red(`Config '${name}' is not valid.\n\t${e}`));
        }
        return valid;
    }
}
exports.ConfigsManager = ConfigsManager;
