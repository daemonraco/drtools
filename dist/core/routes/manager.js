"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesManager = void 0;
const tslib_1 = require("tslib");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class RoutesManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(app, directories, options = {}, configs) {
        super(directories, options, configs);
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    /* istanbul ignore next */
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.RoutesConstants.Suffix,
            urlPrefix: '',
            verbose: true,
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    /* istanbul ignore next */
    loadAndAttach() {
        var _a, _b, _c, _d, _e, _f;
        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
            const str = ((_b = this._options) === null || _b === void 0 ? void 0 : _b.urlPrefix) ? ` (prefix: '${(_c = this._options) === null || _c === void 0 ? void 0 : _c.urlPrefix}')` : '';
            console.log(`Loading routes${str}:`);
        }
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if ((_d = this._options) === null || _d === void 0 ? void 0 : _d.verbose) {
                        console.log(`${includes_1.TAB}- '${chalk_1.default.green(this._itemSpecs[i].name)}'`);
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
                        router.prefix(`${(_e = this._options) === null || _e === void 0 ? void 0 : _e.urlPrefix}/${this._itemSpecs[i].name}`);
                        this._app.use(router.routes());
                    }
                    else {
                        this._app.use(`${(_f = this._options) === null || _f === void 0 ? void 0 : _f.urlPrefix}/${this._itemSpecs[i].name}`, router);
                    }
                    delete global[_1.RoutesConstants.GlobalConfigPointer];
                }
                catch (err) {
                    console.error(chalk_1.default.red(`Unable to load route '${this._itemSpecs[i].name}'.`), err);
                }
            }
        }
    }
}
exports.RoutesManager = RoutesManager;
