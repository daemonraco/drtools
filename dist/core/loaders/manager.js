"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadersManager = void 0;
const tslib_1 = require("tslib");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class LoadersManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(directory, options = null, configs = null) {
        super(directory, options, configs);
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerLoadersManager(this);
    }
    //
    // Public methods.
    load() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
                if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
                    console.log(`Loading loaders:`);
                }
                if (!this._lastError && this._itemSpecs.length > 0) {
                    for (let item of this._itemSpecs) {
                        try {
                            if ((_b = this._options) === null || _b === void 0 ? void 0 : _b.verbose) {
                                console.log(`${includes_1.TAB}- '${chalk_1.default.green(item.name)}'`);
                            }
                            global[_1.LoadersConstants.GlobalConfigsPointer] = this._configs;
                            const lib = require(item.path);
                            let prom = null;
                            if (typeof lib === 'function') {
                                prom = lib();
                            }
                            else if (typeof lib === 'object') {
                                prom = lib;
                            }
                            if (prom && prom instanceof Promise) {
                                yield prom;
                            }
                            delete global[_1.LoadersConstants.GlobalConfigsPointer];
                        }
                        catch (err) {
                            console.error(chalk_1.default.red(`Unable to load loader '${item.name}'.`), err);
                        }
                    }
                }
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
            suffix: _1.LoadersConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
}
exports.LoadersManager = LoadersManager;
