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
const tools_1 = require("../includes/tools");
class MiddlewaresManager {
    //
    // Constructor.
    constructor(app, middlewaresDirectory, options = {}, configs) {
        //
        // Protected properties.
        this._configs = null;
        this._middlewaresDirectory = null;
        this._options = null;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load(app, middlewaresDirectory);
    }
    //
    // Public methods.
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: constants_1.MiddlewaresConstants.Suffix,
            verbose: true
        };
        this._options = tools_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load(app, middlewaresDirectory) {
        let error = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat = null;
            try {
                stat = fs.statSync(middlewaresDirectory);
            }
            catch (e) { }
            if (!stat) {
                console.error(`'${middlewaresDirectory}' does not exist.`);
                error = true;
            }
            else if (!stat.isDirectory()) {
                console.error(`'${middlewaresDirectory}' is not a directory.`);
                error = true;
            }
        }
        let middlewares = [];
        if (!error) {
            //
            // Basic paths and patterns.
            this._middlewaresDirectory = middlewaresDirectory;
            const middlewaresPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            middlewares = fs.readdirSync(this._middlewaresDirectory)
                .filter(x => x.match(middlewaresPattern))
                .map(x => {
                return {
                    name: x.replace(middlewaresPattern, '$1'),
                    path: path.join(this._middlewaresDirectory, x)
                };
            });
        }
        if (!error && middlewares.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading middlewares:`);
            }
            for (let i in middlewares) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(middlewares[i].name)}'`);
                    }
                    app.use(require(middlewares[i].path));
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load middleware '${middlewares[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.MiddlewaresManager = MiddlewaresManager;
