"use strict";
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const glob = require("glob");
const path = require("path");
const configs_1 = require("../configs");
const mock_endpoints_1 = require("../mock-endpoints");
const loaders_1 = require("../loaders");
const middlewares_1 = require("../middlewares");
const includes_1 = require("../includes");
const routes_1 = require("../routes");
const tasks_1 = require("../tasks");
class ExpressConnector {
    //
    // Constructor.
    constructor() { }
    //
    // Public methods.
    attach(app, options = { endpoints: [] }) {
        //
        // Pre-fixing options.
        if (typeof options.endpoints === 'undefined') {
            options.endpoints = [];
        }
        else if (!Array.isArray(options.endpoints)) {
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
            tasksOptions: {},
            publishConfigs: true,
            webUi: false
        };
        options = includes_1.Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results = {
            configs: null,
            endpoints: [],
            loaders: null,
            middlewares: null,
            routes: null,
            tasks: null
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
        results.tasks = this.attachTasks(options, results.configs);
        //
        // Attaching a routes manager.
        results.endpoints = this.attachMockEndpoints(app, options, results.configs);
        //
        // Load Web-UI.
        this.attachWebUI(app, options, results);
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
            manager = new configs_1.ConfigsManager(options.configsDirectory, options.configsOptions);
            if (manager.valid() && options.publishConfigs) {
                const uri = typeof options.publishConfigs === 'string' ? options.publishConfigs : configs_1.ConfigsConstants.PublishUri;
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
            manager = new loaders_1.LoadersManager(options.loadersDirectory, options.loadersOptions, configs);
        }
        return manager;
    }
    attachMiddlewares(app, options, configs) {
        let manager = null;
        if (options.middlewaresDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.middlewaresOptions.verbose === 'undefined') {
                options.middlewaresOptions.verbose = options.verbose;
            }
            manager = new middlewares_1.MiddlewaresManager(app, options.middlewaresDirectory, options.middlewaresOptions, configs);
        }
        return manager;
    }
    attachMockEndpoints(app, options, configs) {
        let managers = [];
        options.endpoints.forEach(endpointOptions => {
            let manager = new mock_endpoints_1.EndpointsManager(endpointOptions, configs);
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
            manager = new routes_1.RoutesManager(app, options.routesDirectory, options.routesOptions, configs);
        }
        return manager;
    }
    attachTasks(options, configs) {
        let manager = null;
        if (options.tasksDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.tasksOptions.verbose === 'undefined') {
                options.tasksOptions.verbose = options.verbose;
            }
            manager = new tasks_1.TasksManager(options.tasksDirectory, options.tasksOptions, configs);
        }
        return manager;
    }
    attachWebUI(app, options, connectorResults) {
        if (options.webUi) {
            app.use(express.static(path.join(__dirname, '../../web-ui/ui')));
            app.all('*', (req, res, next) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let result = null;
                        if (req.hostname.match(/^(localhost|192\.168\..*|10\..*)$/)) {
                            res.header("Access-Control-Allow-Origin", `http://${req.hostname}:4200`);
                        }
                        if (req.query.config) {
                            result = {};
                            if (connectorResults.configs) {
                                let item = null;
                                connectorResults.configs.items().forEach((auxItem) => {
                                    if (auxItem.name === req.query.config) {
                                        item = auxItem;
                                    }
                                });
                                if (item) {
                                    result = includes_1.Tools.DeepCopy(item);
                                    result.contents = connectorResults.configs.get(item.name);
                                }
                            }
                        }
                        else if (req.query.configSpecs) {
                            result = {};
                            if (connectorResults.configs) {
                                let item = null;
                                connectorResults.configs.items().forEach((auxItem) => {
                                    if (auxItem.name === req.query.configSpecs) {
                                        item = auxItem;
                                    }
                                });
                                if (item && item.specsPath) {
                                    result = includes_1.Tools.DeepCopy(item);
                                    result.contents = connectorResults.configs.getSpecs(item.name);
                                }
                            }
                        }
                        else {
                            result = this.buildInfoResponse(connectorResults);
                        }
                        res.status(200).json(result);
                    }
                    else {
                        res.sendFile(path.join(__dirname, '../../web-ui/ui/.drtools/index.html'));
                    }
                }
                else {
                    next();
                }
            });
        }
    }
    buildInfoResponse(connectorResults) {
        const { configs, endpoints, loaders, middlewares, routes, tasks } = connectorResults;
        let results = {};
        results.configs = null;
        if (configs) {
            const publicConfigs = configs.publicItemNames();
            results.configs = {
                directory: configs.directory(),
                environment: configs.environmentName(),
                items: configs.items(),
                publicUri: configs.publicUri(),
                specsDirectory: configs.specsDirectory(),
                suffix: configs.suffix()
            };
        }
        results.loaders = null;
        if (loaders) {
            results.loaders = {
                directory: loaders.directory(),
                items: loaders.items(),
                suffix: loaders.suffix()
            };
        }
        results.middlewares = null;
        if (middlewares) {
            results.middlewares = {
                directory: middlewares.directory(),
                items: middlewares.items(),
                suffix: middlewares.suffix()
            };
        }
        results.routes = null;
        if (routes) {
            results.routes = {
                directory: routes.directory(),
                items: routes.routes(),
                suffix: routes.suffix()
            };
        }
        results.tasks = null;
        if (tasks) {
            results.tasks = {
                directory: tasks.directory(),
                items: tasks.tasks(),
                suffix: tasks.suffix()
            };
        }
        if (endpoints && endpoints.length > 0) {
            results.endpoints = [];
            endpoints.forEach((endpoint) => {
                const directory = endpoint.directory();
                const directoryLength = directory.length;
                const mockups = glob.sync(`${directory}/**/*.json`)
                    .map((p) => p.substr(directoryLength))
                    .map((p) => p.replace(/\.json$/, ''));
                results.endpoints.push({
                    uri: endpoint.uri(),
                    directory, mockups,
                    options: endpoint.options()
                });
            });
        }
        else {
            results.endpoints = null;
        }
        return results;
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
