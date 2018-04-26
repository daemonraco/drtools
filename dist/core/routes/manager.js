"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const includes_1 = require("../includes");
const _1 = require(".");
class RoutesManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(app, directory, options = {}, configs) {
        super(directory, options, configs);
        //
        // Protected properties.
        this._routes = [];
        this.loadAndAttach(app);
        this._valid = !this._lastError;
    }
    //
    // Public methods.
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
                        console.log(`\t- '${libraries_1.chalk.green(this._itemSpecs[i].name)}'`);
                    }
                    global.configs = this._configs;
                    const router = require(this._itemSpecs[i].path);
                    this._routes.push({
                        name: this._itemSpecs[i].name,
                        path: this._itemSpecs[i].path,
                        routes: router.stack
                            .filter((r) => r.route.path !== '*')
                            .map((r) => {
                            return {
                                uri: `/${this._itemSpecs[i].name}${r.route.path}`,
                                methods: r.route.methods
                            };
                        })
                    });
                    app.use(`/${this._itemSpecs[i].name}`, router);
                    delete global.configs;
                }
                catch (e) {
                    console.error(libraries_1.chalk.red(`Unable to load route '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.RoutesManager = RoutesManager;
