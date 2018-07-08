"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const _1 = require(".");
const includes_1 = require("../includes");
class EndpointsManager {
    //
    // Constructor.
    constructor(options, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._endpointsDirectory = null;
        this._endpointsUri = null;
        this._lastError = null;
        this._options = null;
        this._provider = null;
        this._valid = false;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load();
        drcollector_1.DRCollector.registerEndpointsManager(this);
    }
    //
    // Public methods.
    directory() {
        return this._endpointsDirectory;
    }
    lastError() {
        return this._lastError;
    }
    options() {
        return this._options.options;
    }
    paths() {
        return this._provider.paths();
    }
    provide() {
        return this.valid() ? this._provider.expressMiddleware() : this.provideInvalidMiddleware();
    }
    valid() {
        return this._valid;
    }
    uri() {
        return this._endpointsUri;
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            directory: '',
            uri: '',
            options: {}
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load() {
        //
        // Checking given directory path.
        let stat = null;
        try {
            stat = libraries_1.fs.statSync(this._options.directory);
        }
        catch (e) { }
        if (!stat) {
            this._lastError = `'${this._options.directory}' does not exist.`;
            console.error(libraries_1.chalk.red(this._lastError));
        }
        else if (!stat.isDirectory()) {
            this._lastError = `'${this._options.directory}' is not a directory.`;
            console.error(libraries_1.chalk.red(this._lastError));
        }
        //
        // Basic paths.
        if (!this._lastError) {
            this._provider = new _1.Endpoint(this._options.directory, this._options.uri, this._options.options);
            this._endpointsDirectory = this._provider.directory();
            this._endpointsUri = this._provider.uri();
        }
        this._valid = !this._lastError;
    }
    provideInvalidMiddleware() {
        return (req, res, next) => {
            console.error(libraries_1.chalk.red(`EndpointsManager Error: ${this._lastError}`));
            next();
        };
    }
}
exports.EndpointsManager = EndpointsManager;
