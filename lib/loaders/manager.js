"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const includes_1 = require("../includes");
const _1 = require(".");
class LoadersManager extends includes_1.GenericManager {
    //
    // Protected properties.
    //
    // Constructor.
    constructor(directory, options = null, configs = null) {
        super(directory, options, configs);
        this.load();
        this._valid = !this._lastError;
    }
    //
    // Public methods.
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.LoadersConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    load() {
        if (this._options.verbose) {
            console.log(`Loading loaders:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }
                    global.configs = this._configs;
                    require(this._itemSpecs[i].path);
                    delete global.configs;
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load loader '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.LoadersManager = LoadersManager;
