/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
import { ConfigOptions, ConfigsManager } from '../configs';
import { EndpointsManagerOptions, EndpointsManager } from '../mock-endpoints';
import { LoaderOptions, LoadersManager } from '../loaders';
import { MiddlewareOptions, MiddlewaresManager } from '../middlewares';
import { MockRoutesManager, MockRoutesOptions } from '../mock-routes';
import { RouteOptions, RoutesManager } from '../routes';
import { TasksManagerOptions, TasksManager } from '../tasks';
export declare type ExpressMiddleware = (req: any, res: any, next: () => void) => void;
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
    mockRoutesConfig?: string;
    mockRoutesOptions?: MockRoutesOptions;
    endpoints: EndpointsManagerOptions | EndpointsManagerOptions[];
    verbose?: boolean;
    webUi?: boolean;
}
export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    endpoints: EndpointsManager[];
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    mockRoutes: MockRoutesManager;
    routes: RoutesManager;
    tasks: TasksManager;
}
