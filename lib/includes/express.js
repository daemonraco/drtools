"use strict";
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../configs/constants");
const manager_1 = require("../configs/manager");
const manager_2 = require("../middlewares/manager");
const manager_3 = require("../routes/manager");
const tools_1 = require("./tools");
class ExpressConnector {
    //
    // Constructor.
    constructor() { }
    //
    // Public methods.
    attach(app, options = {}) {
        //
        // Cleaning options.
        let defaultOptions = {
            configsOptions: {},
            routesOptions: {},
            publishConfigs: true
        };
        options = tools_1.Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results = {
            configs: null,
            middlewares: null,
            routes: null
        };
        //
        // Attaching a configs manager.
        results.configs = this.attachConfigs(app, options);
        //
        // Attaching a middlewares manager.
        results.middlewares = this.attachMiddlewares(app, options);
        //
        // Attaching a routes manager.
        results.routes = this.attachRoutes(app, options);
        return results;
    }
    //
    // Protected methods.
    attachConfigs(app, options) {
        let manager = null;
        if (options.configsDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.configsOptions.verbose === 'undefined') {
                options.configsOptions.verbose = options.verbose;
            }
            manager = new manager_1.ConfigsManager(options.configsDirectory, options.configsOptions);
            if (options.publishConfigs) {
                const uri = typeof options.publishConfigs === 'string' ? options.publishConfigs : constants_1.ConfigsConstants.PublishUri;
                app.use(manager.publishExports(uri));
            }
        }
        return manager;
    }
    attachMiddlewares(app, options) {
        let manager = null;
        if (options.middlewaresDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.middlewaresOptions.verbose === 'undefined') {
                options.middlewaresOptions.verbose = options.verbose;
            }
            manager = new manager_2.MiddlewaresManager(app, options.middlewaresDirectory, options.middlewaresOptions);
        }
        return manager;
    }
    attachRoutes(app, options) {
        let manager = null;
        if (options.routesDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.routesOptions.verbose === 'undefined') {
                options.routesOptions.verbose = options.verbose;
            }
            manager = new manager_3.RoutesManager(app, options.routesDirectory, options.routesOptions);
        }
        return manager;
    }
    //
    // Public class methods.
    static Instance() {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }
        return ExpressConnector._Instance;
    }
}
//
// Private class properties.
ExpressConnector._Instance = null;
exports.ExpressConnector = ExpressConnector;
