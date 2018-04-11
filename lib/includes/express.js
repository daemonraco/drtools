"use strict";
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../configs/constants");
const manager_1 = require("../configs/manager");
const manager_2 = require("../mock-endpoints/manager");
const manager_3 = require("../loaders/manager");
const manager_4 = require("../middlewares/manager");
const manager_5 = require("../routes/manager");
const tools_1 = require("./tools");
class ExpressConnector {
    //
    // Constructor.
    constructor() { }
    //
    // Public methods.
    attach(app, options = { endpoints: [] }) {
        //
        // Pre-fixing options.
        if (!Array.isArray(options.endpoints)) {
            options.endpoints = [options.endpoints];
        }
        //
        // Cleaning options.
        let defaultOptions = {
            configsOptions: {},
            endpoints: [],
            loadersOptions: {},
            middlewaresOptions: {},
            routesOptions: {},
            publishConfigs: true
        };
        options = tools_1.Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results = {
            configs: null,
            endpoints: [],
            loaders: null,
            middlewares: null,
            routes: null
        };
        //
        // Attaching a configs manager.
        results.configs = this.attachConfigs(app, options);
        //
        // Attaching a middlewares manager.
        results.loaders = this.attachLoaders(options, results.configs);
        //
        // Attaching a middlewares manager.
        results.middlewares = this.attachMiddlewares(app, options, results.configs);
        //
        // Attaching a routes manager.
        results.routes = this.attachRoutes(app, options, results.configs);
        //
        // Attaching a routes manager.
        results.endpoints = this.attachMockEndpoints(app, options, results.configs);
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
    attachLoaders(options, configs) {
        let manager = null;
        if (options.loadersDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.loadersOptions.verbose === 'undefined') {
                options.loadersOptions.verbose = options.verbose;
            }
            manager = new manager_3.LoadersManager(options.loadersDirectory, options.loadersOptions, configs);
        }
        return manager;
    }
    attachMiddlewares(app, options, configs) {
        let manager = null;
        if (options.middlewaresDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.middlewaresOptions.verbose === 'undefined') {
                options.middlewaresOptions.verbose = options.verbose;
            }
            manager = new manager_4.MiddlewaresManager(app, options.middlewaresDirectory, options.middlewaresOptions, configs);
        }
        return manager;
    }
    attachMockEndpoints(app, options, configs) {
        let managers = [];
        options.endpoints.forEach(endpointOptions => {
            let manager = new manager_2.EndpointsManager(endpointOptions, configs);
            app.use(manager.provide());
            managers.push(manager);
        });
        return managers;
    }
    attachRoutes(app, options, configs) {
        let manager = null;
        if (options.routesDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.routesOptions.verbose === 'undefined') {
                options.routesOptions.verbose = options.verbose;
            }
            manager = new manager_5.RoutesManager(app, options.routesDirectory, options.routesOptions, configs);
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
