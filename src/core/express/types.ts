/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary } from '../includes';
import { ConfigOptions, ConfigsManager } from '../configs';
import { EndpointsManagerOptions, EndpointsManager } from '../mock-endpoints';
import { LoaderOptions, LoadersManager } from '../loaders';
import { MiddlewareOptions, MiddlewaresManager } from '../middlewares';
import { MockRoutesManager, MockRoutesOptions } from '../mock-routes';
import { MySQLRestManager, MySQLRestManagerConfig } from '../mysql';
import { PluginsOptions, PluginsManager } from '../plugins';
import { RouteOptions, RoutesManager } from '../routes';
import { TasksManagerOptions, TasksManager } from '../tasks';
import { WebToApi } from '../webtoapi';

export type ExpressMiddleware = (req: any, res: any, next: () => void) => void;

export type MySQLRestExpressConfig = {
    connection: any;
    config: MySQLRestManagerConfig;
}

export interface ExpressConnectorOptions {
    //
    // Configs.
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    //
    // Loaders.
    loadersDirectory?: string;
    loadersOptions?: LoaderOptions;
    //
    // Middlewares.
    middlewaresDirectory?: string;
    middlewaresOptions?: MiddlewareOptions;
    //
    // Loaders.
    pluginsDirectories?: string | string[];
    pluginsOptions?: PluginsOptions;
    //
    // Routes.
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    //
    // Tasks.
    tasksDirectory?: string;
    tasksOptions?: TasksManagerOptions;
    //
    // Mock-up Routes.
    mockRoutesConfig?: string;
    mockRoutesOptions?: MockRoutesOptions;
    //
    // Endpoints.
    endpoints?: EndpointsManagerOptions | EndpointsManagerOptions[];
    //
    // MySQL RESTful endpoints.
    mysqlRest?: MySQLRestExpressConfig;
    //
    // HTML Web to API.
    webToApi?: WebToApiOptions | WebToApiOptions[];
    //
    // General.
    verbose?: boolean;
    webUi?: boolean;
}

export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    endpoints: EndpointsManager[];
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    mockRoutes: MockRoutesManager;
    mysqlRest: MySQLRestManager;
    plugins: PluginsManager;
    routes: RoutesManager;
    tasks: TasksManager;
    webToApi: BasicDictionary<WebToApi>;
}

export interface WebToApiOptions {
    config: string;
    name?: string;
    path: string;
};
