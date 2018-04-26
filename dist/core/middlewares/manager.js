"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const includes_1 = require("../includes");
const _1 = require(".");
class MiddlewaresManager extends includes_1.GenericManager {
    //
    // Protected properties.
    //
    // Constructor.
    constructor(app, directory, options = null, configs = null) {
        super(directory, options, configs);
        this.loadAndAttach(app);
        this._valid = !this._lastError;
    }
    //
    // Public methods.
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.MiddlewaresConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    load() {
        // Nothing to do here.
    }
    loadAndAttach(app) {
        if (this._options.verbose) {
            console.log(`Loading middlewares:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(this._itemSpecs[i].name)}'`);
                    }
                    global.configs = this._configs;
                    app.use(require(this._itemSpecs[i].path));
                    delete global.configs;
                }
                catch (e) {
                    console.error(libraries_1.chalk.red(`Unable to load middleware '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.MiddlewaresManager = MiddlewaresManager;
