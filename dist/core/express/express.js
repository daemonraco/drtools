"use strict";
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const configs_1 = require("../configs");
const mock_endpoints_1 = require("../mock-endpoints");
const _1 = require(".");
const loaders_1 = require("../loaders");
const middlewares_1 = require("../middlewares");
const mock_routes_1 = require("../mock-routes");
const mysql_1 = require("../mysql");
const includes_1 = require("../includes");
const plugins_1 = require("../plugins");
const routes_1 = require("../routes");
const tasks_1 = require("../tasks");
const webtoapi_1 = require("../webtoapi");
class ExpressConnector {
    //
    // Constructor.
    constructor() {
        this._attachments = null;
        this._uiAttached = false;
        this._attachments = {
            configs: null,
            endpoints: [],
            loaders: null,
            middlewares: null,
            mockRoutes: null,
            mysqlRest: null,
            plugins: null,
            routes: null,
            tasks: null,
            webToApi: []
        };
    }
    //
    // Public methods.
    attachments() {
        return this._attachments;
    }
    attach(app, options = { endpoints: [] }) {
        //
        // Pre-fixing options.
        if (typeof options.endpoints === 'undefined') {
            options.endpoints = [];
        }
        else if (!Array.isArray(options.endpoints)) {
            options.endpoints = [options.endpoints];
        }
        if (typeof options.webToApi === 'undefined') {
            options.webToApi = [];
        }
        else if (!Array.isArray(options.webToApi)) {
            options.webToApi = [options.webToApi];
        }
        //
        // Cleaning options.
        let defaultOptions = {
            configsOptions: {},
            endpoints: [],
            loadersOptions: {},
            middlewaresOptions: {},
            mockRoutesOptions: {},
            // mysqlRest: null,
            pluginsOptions: {},
            routesOptions: {},
            tasksOptions: {},
            publishConfigs: true,
            webToApi: [],
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
            mockRoutes: null,
            mysqlRest: null,
            plugins: null,
            routes: null,
            tasks: null,
            webToApi: []
        };
        //
        // Attaching a configs manager.
        results.configs = this.attachConfigs(app, options);
        if (results.configs) {
            this._attachments.configs = results.configs;
        }
        //
        // Attaching a middlewares manager.
        results.loaders = this.attachLoaders(options, results.configs);
        if (results.loaders) {
            this._attachments.loaders = results.loaders;
        }
        //
        // Attaching a middlewares manager.
        results.middlewares = this.attachMiddlewares(app, options, results.configs);
        if (results.middlewares) {
            this._attachments.middlewares = results.middlewares;
        }
        //
        // Attaching a routes manager.
        results.mockRoutes = this.attachMockRoutes(app, options, results.configs);
        if (results.mockRoutes) {
            this._attachments.mockRoutes = results.mockRoutes;
        }
        //
        // Attaching a plugins manager.
        results.plugins = this.attachPlugins(options, results.configs);
        if (results.plugins) {
            this._attachments.plugins = results.plugins;
        }
        //
        // Attaching a routes manager.
        results.routes = this.attachRoutes(app, options, results.configs);
        if (results.routes) {
            this._attachments.routes = results.routes;
        }
        //
        // Attaching a routes manager.
        results.tasks = this.attachTasks(options, results.configs);
        if (results.tasks) {
            this._attachments.tasks = results.tasks;
        }
        //
        // Attaching a routes manager.
        results.endpoints = this.attachMockEndpoints(app, options, results.configs);
        for (const endpoint of results.endpoints) {
            this._attachments.endpoints.push(endpoint);
        }
        //
        // Attaching a MySQL manager.
        results.mysqlRest = this.attachMySQLRest(app, options);
        if (results.mysqlRest) {
            this._attachments.mysqlRest = results.mysqlRest;
        }
        //
        // Attaching a MySQL manager.
        results.webToApi = this.attachWebToApi(app, options.webToApi);
        if (results.webToApi.length > 0) {
            for (const w of results.webToApi) {
                this._attachments.webToApi.push(w);
            }
        }
        //
        // Load Web-UI.
        this.attachWebUI(app, options);
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
    attachMockRoutes(app, options, configs) {
        let manager = null;
        if (options.mockRoutesConfig) {
            if (typeof options.verbose !== 'undefined' && typeof options.mockRoutesOptions.verbose === 'undefined') {
                options.mockRoutesOptions.verbose = options.verbose;
            }
            manager = new mock_routes_1.MockRoutesManager(app, options.mockRoutesConfig, options.mockRoutesOptions, configs);
        }
        return manager;
    }
    attachMySQLRest(app, options) {
        let manager = null;
        if (options.mysqlRest) {
            manager = new mysql_1.MySQLRestManager(options.mysqlRest.connection, options.mysqlRest.config);
            app.use(manager.middleware());
        }
        return manager;
    }
    attachPlugins(options, configs) {
        let manager = null;
        if (options.pluginsDirectories) {
            if (typeof options.verbose !== 'undefined' && typeof options.pluginsOptions.verbose === 'undefined') {
                options.pluginsOptions.verbose = options.verbose;
            }
            manager = new plugins_1.PluginsManager(options.pluginsDirectories, options.pluginsOptions, configs);
        }
        return manager;
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
    attachWebToApi(app, options) {
        let managers = [];
        for (const opts of options) {
            const manager = new webtoapi_1.WebToApi(opts.config);
            app.use(opts.path, manager.router());
            managers.push(manager);
        }
        return managers;
    }
    attachWebUI(app, options) {
        if (options.webUi && !this._uiAttached) {
            this._uiAttached = true;
            app.use(libraries_1.express.static(libraries_1.path.join(__dirname, '../../../web-ui/ui')));
            app.all('*', (req, res, next) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let response;
                        let result = null;
                        if (req.hostname.match(/^(localhost|127.0.0.1|192\.168\..*|10\..*)$/)) {
                            res.header("Access-Control-Allow-Origin", `http://${req.hostname}:4200`);
                        }
                        if (req.query.config) {
                            result = _1.ExpressResponseBuilder.ConfigContents(this._attachments.configs, req.query.config);
                        }
                        else if (req.query.configSpecs) {
                            result = _1.ExpressResponseBuilder.ConfigSpecsContents(this._attachments.configs, req.query.configSpecs);
                        }
                        else if (req.query.doc) {
                            result = _1.ExpressResponseBuilder.DocsContents(req.query.doc, req.query.baseUrl);
                        }
                        else {
                            result = _1.ExpressResponseBuilder.FullInfoResponse(this._attachments);
                        }
                        res.status(200).json(result);
                    }
                    else {
                        res.sendFile(libraries_1.path.join(__dirname, '../../../web-ui/ui/.drtools/index.html'));
                    }
                }
                else {
                    next();
                }
            });
        }
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
