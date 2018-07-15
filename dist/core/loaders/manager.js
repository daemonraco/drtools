"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
                if (this._options.verbose) {
                    console.log(`Loading loaders:`);
                }
                if (!this._lastError && this._itemSpecs.length > 0) {
                    for (let item of this._itemSpecs) {
                        try {
                            if (this._options.verbose) {
                                console.log(`\t- '${libraries_1.chalk.green(item.name)}'`);
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
                        catch (e) {
                            console.error(libraries_1.chalk.red(`Unable to load loader '${item.name}'.\n\t${e}`));
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
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.LoadersConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
}
exports.LoadersManager = LoadersManager;
