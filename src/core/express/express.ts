/**
 * @file express.ts
 * @author Alejandro D. Simi
 */

import { express, path } from '../../libraries';

import { BasicDictionary, Tools } from '../includes';
import { ConfigsConstants, ConfigsManager } from '../configs';
import { EndpointsManager, EndpointsManagerOptions } from '../mock-endpoints';
import { ExpressConnectorAttachResults, ExpressConnectorOptions, ExpressResponseBuilder, MySQLRestExpressConfig, WebToApiOptions } from '.';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { MySQLRestManager } from '../mysql';
import { PluginsManager } from '../plugins';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';
import { WebToApi } from '../webtoapi';

export class ExpressConnector {
    //
    // Private class properties.
    private static _Instance: ExpressConnector = null;
    protected _attachments: ExpressConnectorAttachResults = null;
    protected _uiAttached: boolean = false;
    //
    // Constructor.
    private constructor() {
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
            webToApi: {}
        };
    }
    //
    // Public methods.
    public attachments(): ExpressConnectorAttachResults {
        return this._attachments;
    }
    public attach(app: any, options: ExpressConnectorOptions = { endpoints: [] }): ExpressConnectorAttachResults {
        //
        // Pre-fixing options.
        if (typeof options.endpoints === 'undefined') {
            options.endpoints = [];
        } else if (!Array.isArray(options.endpoints)) {
            options.endpoints = [options.endpoints];
        }
        if (typeof options.webToApi === 'undefined') {
            options.webToApi = [];
        } else if (!Array.isArray(options.webToApi)) {
            options.webToApi = [options.webToApi];
        }
        //
        // Cleaning options.
        let defaultOptions: ExpressConnectorOptions = {
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
        options = Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results: ExpressConnectorAttachResults = {
            configs: null,
            endpoints: [],
            loaders: null,
            middlewares: null,
            mockRoutes: null,
            mysqlRest: null,
            plugins: null,
            routes: null,
            tasks: null,
            webToApi: {}
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
        // Attaching a WebToApi managers.
        results.webToApi = this.attachWebToApi(app, <WebToApiOptions[]>options.webToApi);
        if (Object.keys(results.webToApi).length > 0) {
            for (const k of Object.keys(results.webToApi)) {
                this._attachments.webToApi[k] = results.webToApi[k];
            }
        }
        //
        // Load Web-UI.
        this.attachWebUI(app, options);

        return results;
    }
    //
    // Protected methods.
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager {
        let manager: ConfigsManager = null;

        if (options.configsDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.configsOptions.verbose === 'undefined') {
                options.configsOptions.verbose = options.verbose;
            }

            manager = new ConfigsManager(options.configsDirectory, options.configsOptions);

            if (manager.valid() && options.publishConfigs) {
                const uri: string = typeof options.publishConfigs === 'string' ? options.publishConfigs : ConfigsConstants.PublishUri;
                app.use(manager.publishExports(uri));
            }
        }

        return manager;
    }
    protected attachLoaders(options: ExpressConnectorOptions, configs: ConfigsManager): LoadersManager {
        let manager: LoadersManager = null;

        if (options.loadersDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.loadersOptions.verbose === 'undefined') {
                options.loadersOptions.verbose = options.verbose;
            }

            manager = new LoadersManager(options.loadersDirectory, options.loadersOptions, configs);
        }

        return manager;
    }
    protected attachMiddlewares(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MiddlewaresManager {
        let manager: MiddlewaresManager = null;

        if (options.middlewaresDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.middlewaresOptions.verbose === 'undefined') {
                options.middlewaresOptions.verbose = options.verbose;
            }

            manager = new MiddlewaresManager(app, options.middlewaresDirectory, options.middlewaresOptions, configs);
        }

        return manager;
    }
    protected attachMockEndpoints(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): EndpointsManager[] {
        let managers: EndpointsManager[] = [];

        (<EndpointsManagerOptions[]>options.endpoints).forEach(endpointOptions => {
            let manager: EndpointsManager = new EndpointsManager(endpointOptions, configs);
            app.use(manager.provide());
            managers.push(manager);
        });

        return managers;
    }
    protected attachMockRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MockRoutesManager {
        let manager: MockRoutesManager = null;

        if (options.mockRoutesConfig) {
            if (typeof options.verbose !== 'undefined' && typeof options.mockRoutesOptions.verbose === 'undefined') {
                options.mockRoutesOptions.verbose = options.verbose;
            }

            manager = new MockRoutesManager(app, options.mockRoutesConfig, options.mockRoutesOptions, configs);
        }

        return manager;
    }
    protected attachMySQLRest(app: any, options: ExpressConnectorOptions): MySQLRestManager {
        let manager: MySQLRestManager = null;

        if (options.mysqlRest) {
            manager = new MySQLRestManager(options.mysqlRest.connection, options.mysqlRest.config);
            app.use(manager.middleware());
        }

        return manager;
    }
    protected attachPlugins(options: ExpressConnectorOptions, configs: ConfigsManager): PluginsManager {
        let manager: PluginsManager = null;

        if (options.pluginsDirectories) {
            if (typeof options.verbose !== 'undefined' && typeof options.pluginsOptions.verbose === 'undefined') {
                options.pluginsOptions.verbose = options.verbose;
            }

            manager = new PluginsManager(options.pluginsDirectories, options.pluginsOptions, configs);
        }

        return manager;
    }
    protected attachRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): RoutesManager {
        let manager: RoutesManager = null;

        if (options.routesDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.routesOptions.verbose === 'undefined') {
                options.routesOptions.verbose = options.verbose;
            }

            manager = new RoutesManager(app, options.routesDirectory, options.routesOptions, configs);
        }

        return manager;
    }
    protected attachTasks(options: ExpressConnectorOptions, configs: ConfigsManager): TasksManager {
        let manager: TasksManager = null;

        if (options.tasksDirectory) {
            if (typeof options.verbose !== 'undefined' && typeof options.tasksOptions.verbose === 'undefined') {
                options.tasksOptions.verbose = options.verbose;
            }

            manager = new TasksManager(options.tasksDirectory, options.tasksOptions, configs);
        }

        return manager;
    }
    protected attachWebToApi(app: any, options: WebToApiOptions[]): BasicDictionary<WebToApi> {
        let managers: BasicDictionary<WebToApi> = {};

        for (const opts of options) {
            if (!opts.name) {
                opts.name = opts.path
            }

            const manager: WebToApi = new WebToApi(opts.config);
            app.use(opts.path, manager.router());

            managers[opts.name] = manager;
        }

        return managers;
    }
    protected attachWebUI(app: any, options: ExpressConnectorOptions): void {
        if (options.webUi && !this._uiAttached) {
            this._uiAttached = true;

            app.use(express.static(path.join(__dirname, '../../../web-ui/ui')));

            app.all('*', (req: any, res: any, next: () => void) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let response: ExpressResponseBuilder
                        let result: any = null;

                        if (req.hostname.match(/^(localhost|127.0.0.1|192\.168\..*|10\..*)$/)) {
                            res.header("Access-Control-Allow-Origin", `http://${req.hostname}:4200`);
                        }

                        if (req.query.config) {
                            result = ExpressResponseBuilder.ConfigContents(this._attachments.configs, req.query.config);
                        } else if (req.query.configSpecs) {
                            result = ExpressResponseBuilder.ConfigSpecsContents(this._attachments.configs, req.query.configSpecs);
                        } else if (req.query.doc) {
                            result = ExpressResponseBuilder.DocsContents(req.query.doc, req.query.baseUrl);
                        } else {
                            result = ExpressResponseBuilder.FullInfoResponse(this._attachments);
                        }

                        res.status(200).json(result);
                    } else {
                        res.sendFile(path.join(__dirname, '../../../web-ui/ui/.drtools/index.html'));
                    }
                } else {
                    next();
                }
            });
        }
    }
    //
    // Public class methods.
    public static Instance(): ExpressConnector {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }

        return ExpressConnector._Instance;
    }
}
