/**
 * @file express.ts
 * @author Alejandro D. Simi
 */

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigItemSpec, ConfigsConstants, ConfigsManager } from '../configs';
import { Endpoint, EndpointsManager, EndpointsManagerOptions } from '../mock-endpoints';
import { ExpressConnectorAttachResults, ExpressConnectorOptions, ExpressResponseBuilder } from '.';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { OptionsList, Tools } from '../includes';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';

export class ExpressConnector {
    //
    // Private class properties.
    private static _Instance: ExpressConnector = null;
    //
    // Constructor.
    private constructor() { }
    //
    // Public methods.
    public attach(app: any, options: ExpressConnectorOptions = { endpoints: [] }): ExpressConnectorAttachResults {
        //
        // Pre-fixing options.
        if (typeof options.endpoints === 'undefined') {
            options.endpoints = [];
        } else if (!Array.isArray(options.endpoints)) {
            options.endpoints = [options.endpoints];
        }
        //
        // Cleaning options.
        let defaultOptions: ExpressConnectorOptions = {
            configsOptions: {},
            endpoints: [],
            loadersOptions: {},
            middlewaresOptions: {},
            mockRoutesOptions: {},
            routesOptions: {},
            tasksOptions: {},
            publishConfigs: true,
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
        results.mockRoutes = this.attachMockRoutes(app, options, results.configs);
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
    protected attachWebUI(app: any, options: ExpressConnectorOptions, connectorResults: ExpressConnectorAttachResults): void {
        if (options.webUi) {
            app.use(express.static(path.join(__dirname, '../../web-ui/ui')));

            app.all('*', (req: any, res: any, next: () => void) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let response: ExpressResponseBuilder
                        let result: any = null;

                        if (req.hostname.match(/^(localhost|192\.168\..*|10\..*)$/)) {
                            res.header("Access-Control-Allow-Origin", `http://${req.hostname}:4200`);
                        }

                        if (req.query.config) {
                            result = ExpressResponseBuilder.ConfigContents(connectorResults.configs, req.query.config);
                        } else if (req.query.configSpecs) {
                            result = ExpressResponseBuilder.ConfigSpecsContents(connectorResults.configs, req.query.configSpecs);
                        } else if (req.query.doc) {
                            result = ExpressResponseBuilder.DocsContents(req.query.doc, req.query.baseUrl);
                        } else {
                            result = ExpressResponseBuilder.FullInfoResponse(connectorResults);
                        }

                        res.status(200).json(result);
                    } else {
                        res.sendFile(path.join(__dirname, '../../web-ui/ui/.drtools/index.html'));
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
