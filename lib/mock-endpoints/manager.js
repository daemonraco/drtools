"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import * as chalk from 'chalk';
const fs = require("fs");
const endpoint_1 = require("../mock-endpoints/endpoint");
const tools_1 = require("../includes/tools");
// declare const global: any;
class EndpointsManager {
    //
    // Constructor.
    constructor(options, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._provider = null;
        this._endpointsDirectory = null;
        this._endpointsUri = null;
        this._options = null;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load();
    }
    //
    // Public methods.
    provide() {
        return this._provider.expressMiddleware();
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            directory: '',
            uri: '',
            options: {}
        };
        this._options = tools_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load() {
        let error = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat = null;
            try {
                stat = fs.statSync(this._options.directory);
            }
            catch (e) { }
            if (!stat) {
                console.error(`'${this._options.directory}' does not exist.`);
                error = true;
            }
            else if (!stat.isDirectory()) {
                console.error(`'${this._options.directory}' is not a directory.`);
                error = true;
            }
        }
        //
        // Basic paths.
        if (!error) {
            this._endpointsDirectory = this._options.directory;
            this._endpointsUri = this._options.uri;
            this._provider = new endpoint_1.Endpoint(this._endpointsDirectory, this._endpointsUri, this._options);
        }
    }
}
exports.EndpointsManager = EndpointsManager;
