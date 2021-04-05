"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewaresManager = void 0;
const tslib_1 = require("tslib");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
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
    load() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
                this.loadAndAttach();
                this._valid = !this._lastError;
            }
            return this.valid();
        });
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
        var _a, _b;
        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
            console.log(`Loading middlewares:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let item of this._itemSpecs) {
                try {
                    if ((_b = this._options) === null || _b === void 0 ? void 0 : _b.verbose) {
                        console.log(`\t- '${chalk_1.default.green(item.name)}'`);
                    }
                    global.configs = this._configs;
                    this._app.use(require(item.path));
                    delete global.configs;
                }
                catch (err) {
                    console.error(chalk_1.default.red(`Unable to load middleware '${item.name}'.`), err);
                }
            }
        }
    }
}
exports.MiddlewaresManager = MiddlewaresManager;
