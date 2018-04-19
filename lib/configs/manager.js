"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
const chalk = require("chalk");
const fs = require("fs");
const jsonpath = require("jsonpath-plus");
const path = require("path");
const _1 = require(".");
const includes_1 = require("../includes");
class ConfigsManager {
    //
    // Constructor.
    constructor(directory, options = {}) {
        //
        // Protected properties.
        this._configs = {};
        this._directory = null;
        this._environmentName = null;
        this._exports = {};
        this._lastError = null;
        this._options = null;
        this._specs = {};
        this._specsDirectory = null;
        this._valid = false;
        this._directory = directory;
        this._specsDirectory = path.join(directory, 'specs');
        this._options = options;
        this.cleanOptions();
        this.load();
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
        return typeof this._configs[name] !== 'undefined' ? this._configs[name] : {};
    }
    getSpecs(name) {
        return typeof this._specs[name] !== 'undefined' ? this._specs[name] : null;
    }
    itemNames() {
        return Object.keys(this._configs);
    }
    lastError() {
        return this._lastError;
    }
    publicItemNames() {
        return Object.keys(this._exports);
    }
    publishExports(uri = _1.ConfigsConstants.PublishUri) {
        //
        // Cleaning URI @{
        uri = `/${uri}/`;
        [
            ['//', '/']
        ].forEach((pair) => {
            while (uri.indexOf(pair[0]) > -1) {
                uri = uri.replace(pair[0], pair[1]);
            }
        });
        uri = uri.substr(0, uri.length - 1);
        uri = uri.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}
        const pattern = new RegExp(`^${uri}([\\/]?)(.*)$`);
        return (req, res, next) => {
            let responded = false;
            if (req.originalUrl.match(pattern)) {
                const name = req.originalUrl.replace(pattern, '$2');
                if (name) {
                    if (typeof this._exports[name] !== 'undefined') {
                        res.json(this._exports[name]);
                    }
                    else {
                        res.status(404).json({
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
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.ConfigsConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load() {
        this._lastError = null;
        //
        // Loading environment names.
        this._environmentName = process.env.ENV_NAME || process.env.NODE_ENV || global.ENV_NAME || global.NODE_ENV || 'default';
        if (this._options.verbose) {
            console.log(`Loading configs (environment: ${chalk.green(this._environmentName)}):`);
        }
        //
        // Checking given directory path.
        if (!this._lastError) {
            let stat = null;
            try {
                stat = fs.statSync(this._directory);
            }
            catch (e) { }
            if (!stat) {
                this._lastError = `'${this._directory}' does not exist.`;
                console.error(chalk.red(this._lastError));
            }
            else if (!stat.isDirectory()) {
                this._lastError = `'${this._directory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
            }
        }
        if (!this._lastError) {
            let stat = null;
            try {
                stat = fs.statSync(this._specsDirectory);
            }
            catch (e) { }
            if (!stat) {
                this._specsDirectory = null;
            }
            else if (!stat.isDirectory()) {
                this._lastError = `'${this._specsDirectory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
            }
        }
        let files = [];
        if (!this._lastError) {
            //
            // Basic patterns.
            const configPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const envPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading basic configuration files.
            files = fs.readdirSync(this._directory)
                .filter(x => x.match(configPattern))
                .map(x => {
                return {
                    name: x.replace(configPattern, '$1'),
                    path: path.resolve(path.join(this._directory, x))
                };
            });
            //
            // Loading evironment specific configuration files.
            const envFiles = fs.readdirSync(this._directory)
                .filter(x => x.match(envPattern))
                .map(x => {
                return {
                    name: x.replace(envPattern, '$1'),
                    path: path.resolve(path.join(this._directory, x))
                };
            });
            //
            // Merging lists.
            for (let i in files) {
                for (let j in envFiles) {
                    if (files[i].name === envFiles[j].name) {
                        files[i].specific = envFiles[j];
                        break;
                    }
                }
            }
        }
        this._configs = {};
        this._exports = {};
        if (!this._lastError) {
            for (let i in files) {
                let valid = true;
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(files[i].name)}'${files[i].specific ? ` (has specific configuration)` : ''}`);
                    }
                    //
                    // Loading basic configuration.
                    this._configs[files[i].name] = require(files[i].path);
                    //
                    // Merging with the environment specific configuration.
                    if (files[i].specific) {
                        this._configs[files[i].name] = includes_1.Tools.DeepMergeObjects(this._configs[files[i].name], require(files[i].specific.path));
                    }
                    //
                    // Does it have specs?
                    if (this._specsDirectory && this.loadSpecsOf(files[i].name)) {
                        valid = this.validateSpecsOf(files[i].name);
                    }
                    //
                    // If there were no errors validating the config file, it can
                    // expose exports.
                    if (valid) {
                        this.loadExportsOf(files[i].name);
                    }
                    else {
                        this._configs[files[i].name] = {};
                    }
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load config '${files[i].name}'.\n\t${e}`));
                }
            }
        }
        this._valid = !this._lastError;
    }
    loadExportsOf(name) {
        const config = this._configs[name];
        if (typeof config.$exports !== 'undefined' || typeof config.$pathExports !== 'undefined') {
            this._exports[name] = {};
        }
        if (typeof config.$exports !== 'undefined') {
            this._exports[name] = includes_1.Tools.DeepMergeObjects(this._exports[name], config.$exports);
        }
        if (typeof config.$pathExports !== 'undefined') {
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
            }
        }
    }
    loadSpecsOf(name) {
        let hasSpecs = false;
        const specsPath = path.join(this._specsDirectory, `${name}.json`);
        let stat = null;
        try {
            stat = fs.statSync(specsPath);
        }
        catch (e) { }
        if (!stat) {
            // Nothing not to do.
        }
        else if (!stat.isFile()) {
            this._lastError = `'${this._directory}' is not a file.`;
            console.error(chalk.red(this._lastError));
        }
        else {
            hasSpecs = true;
        }
        return hasSpecs;
    }
    validateSpecsOf(name) {
        let valid = false;
        const specsPath = path.join(this._specsDirectory, `${name}.json`);
        this._specs[name] = null;
        try {
            this._specs[name] = require(specsPath);
        }
        catch (e) {
            this._lastError = `'${this._directory}' is not valid specification file. ${e}`;
            console.error(chalk.red(this._lastError));
        }
        //
        // Creating a validator.
        try {
            const ajvObj = new ajv({
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
            console.error(chalk.red(`Config '${name}' is not valid.\n\t${e}`));
        }
        return valid;
    }
}
exports.ConfigsManager = ConfigsManager;
