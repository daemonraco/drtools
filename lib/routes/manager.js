"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const includes_1 = require("../includes");
const _1 = require(".");
class RoutesManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(app, directory, options = {}, configs) {
        super(directory, options, configs);
        //
        // Protected properties.
        this._hasSpecialLoad = true;
        this.loadAndAttach(app);
        this._valid = !this._lastError;
    }
    //
    // Public methods.
    routes() {
        return this._itemSpecs.map((r) => r.name);
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.RoutesConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    load() {
        // Nothing to do here.
    }
    loadAndAttach(app) {
        if (this._options.verbose) {
            console.log(`Loading routes:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }
                    global.configs = this._configs;
                    app.use(`/${this._itemSpecs[i].name}`, require(this._itemSpecs[i].path));
                    delete global.configs;
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load route '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.RoutesManager = RoutesManager;
