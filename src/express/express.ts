/**
 * @file express.ts
 * @author Alejandro D. Simi
 */

import { ConfigsConstants, ConfigsManager } from '../configs';
import { Endpoint, EndpointsManager, EndpointsManagerOptions } from '../mock-endpoints';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from '.';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { RoutesManager } from '../routes';
import { OptionsList, Tools } from '../includes';

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
            routesOptions: {},
            publishConfigs: true
        };
        options = Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results: ExpressConnectorAttachResults = {
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
    //
    // Public class methods.
    public static Instance(): ExpressConnector {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }

        return ExpressConnector._Instance;
    }
}
