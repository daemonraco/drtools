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
class LoadersManager {
    //
    // Constructor.
    constructor(loadersDirectory, options = {}, configs) {
        //
        // Protected properties.
        this._configs = null;
        this._loadersDirectory = null;
        this._options = null;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load(loadersDirectory);
    }
    //
    // Public methods.
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: constants_1.LoadersConstants.Suffix,
            verbose: true
        };
        this._options = tools_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load(loadersDirectory) {
        let error = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat = null;
            try {
                stat = fs.statSync(loadersDirectory);
            }
            catch (e) { }
            if (!stat) {
                console.error(`'${loadersDirectory}' does not exist.`);
                error = true;
            }
            else if (!stat.isDirectory()) {
                console.error(`'${loadersDirectory}' is not a directory.`);
                error = true;
            }
        }
        let loaders = [];
        if (!error) {
            //
            // Basic paths and patterns.
            this._loadersDirectory = loadersDirectory;
            const loadersPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            loaders = fs.readdirSync(this._loadersDirectory)
                .filter(x => x.match(loadersPattern))
                .map(x => {
                return {
                    name: x.replace(loadersPattern, '$1'),
                    path: path.join(this._loadersDirectory, x)
                };
            });
        }
        if (!error && loaders.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading loaders:`);
            }
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
    }
}
exports.LoadersManager = LoadersManager;
