/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */

import { ConfigOptions, ConfigsManager } from '../configs';
import { EndpointsManagerOptions, EndpointsManager } from '../mock-endpoints';
import { LoaderOptions, LoadersManager } from '../loaders';
import { MiddlewareOptions, MiddlewaresManager } from '../middlewares';
import { RouteOptions, RoutesManager } from '../routes';

export type ExpressMiddleware = (res: any, req: any, next: () => void) => void;

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
    // Routes.
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    //
    // Endpoints.
    endpoints: EndpointsManagerOptions | EndpointsManagerOptions[];
    //
    // General.
    verbose?: boolean;
}

export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    endpoints: EndpointsManager[];
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    routes: RoutesManager;
}
