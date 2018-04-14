"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const constants_1 = require("./constants");
const includes_1 = require("../includes");
class MiddlewaresManager {
    //
    // Constructor.
    constructor(app, directory, options = {}, configs) {
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
        this.load(app, directory);
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
            suffix: constants_1.MiddlewaresConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load(app, directory) {
        if (this._options.verbose) {
            console.log(`Loading middlewares:`);
        }
        //
        // Checking given directory path.
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
        let middlewares = [];
        if (!this._lastError) {
            //
            // Basic paths and patterns.
            this._directory = directory;
            const middlewaresPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            middlewares = fs.readdirSync(this._directory)
                .filter(x => x.match(middlewaresPattern))
                .map(x => {
                return {
                    name: x.replace(middlewaresPattern, '$1'),
                    path: path.join(this._directory, x)
                };
            });
        }
        if (!this._lastError && middlewares.length > 0) {
            for (let i in middlewares) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(middlewares[i].name)}'`);
                    }
                    global.configs = this._configs;
                    app.use(require(middlewares[i].path));
                    delete global.configs;
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load middleware '${middlewares[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.MiddlewaresManager = MiddlewaresManager;
