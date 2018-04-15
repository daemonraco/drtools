/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
import { ConfigOptions, ConfigsManager } from '../configs';
import { EndpointsManagerOptions, EndpointsManager } from '../mock-endpoints';
import { LoaderOptions, LoadersManager } from '../loaders';
import { MiddlewareOptions, MiddlewaresManager } from '../middlewares';
import { RouteOptions, RoutesManager } from '../routes';
import { TasksManagerOptions, TasksManager } from '../tasks';
export declare type ExpressMiddleware = (res: any, req: any, next: () => void) => void;
export interface ExpressConnectorOptions {
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    loadersDirectory?: string;
    loadersOptions?: LoaderOptions;
    middlewaresDirectory?: string;
    middlewaresOptions?: MiddlewareOptions;
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    tasksDirectory?: string;
    tasksOptions?: TasksManagerOptions;
    endpoints: EndpointsManagerOptions | EndpointsManagerOptions[];
    verbose?: boolean;
}
export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    endpoints: EndpointsManager[];
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    routes: RoutesManager;
    tasks: TasksManager;
}
