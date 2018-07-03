/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
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
export declare type ExpressMiddleware = (req: any, res: any, next: () => void) => void;
export declare type MySQLRestExpressConfig = {
    connection: any;
    config: MySQLRestManagerConfig;
};
export interface ExpressConnectorOptions {
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    loadersDirectory?: string;
    loadersOptions?: LoaderOptions;
    middlewaresDirectory?: string;
    middlewaresOptions?: MiddlewareOptions;
    pluginsDirectories?: string | string[];
    pluginsOptions?: PluginsOptions;
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    tasksDirectory?: string;
    tasksOptions?: TasksManagerOptions;
    mockRoutesConfig?: string;
    mockRoutesOptions?: MockRoutesOptions;
    endpoints?: EndpointsManagerOptions | EndpointsManagerOptions[];
    mysqlRest?: MySQLRestExpressConfig;
    webToApi?: WebToApiOptions | WebToApiOptions[];
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
    webToApi: WebToApi[];
}
export interface WebToApiOptions {
    config: string;
    path: string;
}
