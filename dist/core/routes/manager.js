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
class RoutesManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(app, directory, options = {}, configs) {
        super(directory, options, configs);
        //
        // Protected properties.
        this._app = null;
        this._isKoa = false;
        this._routes = [];
        this._app = app;
        this._isKoa = includes_1.Tools.IsKoa(this._app);
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerRoutesManager(this);
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
    routes() {
        return this._routes;
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
    loadAndAttach() {
        if (this._options.verbose) {
            console.log(`Loading routes:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(this._itemSpecs[i].name)}'`);
                    }
                    global[_1.RoutesConstants.GlobalConfigPointer] = this._configs;
                    const router = require(this._itemSpecs[i].path);
                    this._routes.push({
                        name: this._itemSpecs[i].name,
                        path: this._itemSpecs[i].path,
                        routes: router.stack
                            .filter((r) => (this._isKoa && r.path !== '*') || (!this._isKoa && r.route.path !== '*'))
                            .map((r) => {
                            return {
                                uri: this._isKoa
                                    ? `/${this._itemSpecs[i].name}${r.path}`
                                    : `/${this._itemSpecs[i].name}${r.route.path}`,
                                methods: this._isKoa
                                    ? r.methods
                                    : r.route.methods,
                            };
                        })
                    });
                    if (this._isKoa) {
                        router.prefix(`/${this._itemSpecs[i].name}`);
                        this._app.use(router.routes());
                    }
                    else {
                        this._app.use(`/${this._itemSpecs[i].name}`, router);
                    }
                    delete global[_1.RoutesConstants.GlobalConfigPointer];
                }
                catch (err) {
                    console.error(libraries_1.chalk.red(`Unable to load route '${this._itemSpecs[i].name}'.`), err);
                }
            }
        }
    }
}
exports.RoutesManager = RoutesManager;
