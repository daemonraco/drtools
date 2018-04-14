"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const _1 = require(".");
const includes_1 = require("../includes");
class LoadersManager {
    //
    // Constructor.
    constructor(directory, options = {}, configs) {
        //
        // Protected properties.
        this._configs = null;
        this._directory = null;
        this._lastError = null;
        this._options = null;
        this._valid = false;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load(directory);
    }
    //
    // Public methods.
    directory() {
        return this._directory;
    }
    lastError() {
        return this._lastError;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.LoadersConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load(directory) {
        if (this._options.verbose) {
            console.log(`Loading loaders:`);
        }
        //
        // Checking given directory path.
        if (!this._lastError) {
            let stat = null;
            try {
                stat = fs.statSync(directory);
            }
            catch (e) { }
            if (!stat) {
                this._lastError = `'${directory}' does not exist.`;
                console.error(chalk.red(this._lastError));
            }
            else if (!stat.isDirectory()) {
                this._lastError = `'${directory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
            }
        }
        let loaders = [];
        if (!this._lastError) {
            //
            // Basic paths and patterns.
            this._directory = directory;
            const loadersPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            loaders = fs.readdirSync(this._directory)
                .filter(x => x.match(loadersPattern))
                .map(x => {
                return {
                    name: x.replace(loadersPattern, '$1'),
                    path: path.join(this._directory, x)
                };
            });
        }
        if (!this._lastError && loaders.length > 0) {
            for (let i in loaders) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(loaders[i].name)}'`);
                    }
                    global.configs = this._configs;
                    require(loaders[i].path);
                    delete global.configs;
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load loader '${loaders[i].name}'.\n\t${e}`));
                }
            }
        }
        this._valid = !this._lastError;
    }
}
exports.LoadersManager = LoadersManager;
