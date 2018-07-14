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
class MiddlewaresManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(app, directory, options = null, configs = null) {
        super(directory, options, configs);
        //
        // Protected properties.
        this._expressApp = null;
        this._expressApp = app;
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerMiddlewaresManager(this);
    }
    //
    // Public methods.
    load() {
        return __awaiter(this, void 0, void 0, function* () {
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
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.MiddlewaresConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
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
                    this._expressApp.use(require(item.path));
                    delete global.configs;
                }
                catch (e) {
                    console.error(libraries_1.chalk.red(`Unable to load middleware '${item.name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.MiddlewaresManager = MiddlewaresManager;
