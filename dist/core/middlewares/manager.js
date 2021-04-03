"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewaresManager = void 0;
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
class MiddlewaresManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(app, directory, options = null, configs = null) {
        super(directory, options, configs);
        //
        // Protected properties.
        this._app = null;
        this._app = app;
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerMiddlewaresManager(this);
    }
    //
    // Public methods.
    async load() {
        if (!this._loaded) {
            this._loaded = true;
            this.loadAndAttach();
            this._valid = !this._lastError;
        }
        return this.valid();
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.MiddlewaresConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    /* istanbul ignore next */
    loadAndAttach() {
        if (this._options.verbose) {
            console.log(`Loading middlewares:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let item of this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(item.name)}'`);
                    }
                    global.configs = this._configs;
                    this._app.use(require(item.path));
                    delete global.configs;
                }
                catch (err) {
                    console.error(libraries_1.chalk.red(`Unable to load middleware '${item.name}'.`), err);
                }
            }
        }
    }
}
exports.MiddlewaresManager = MiddlewaresManager;
