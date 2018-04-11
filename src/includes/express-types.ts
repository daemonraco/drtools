/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */

import { ConfigOptions, ConfigsManager } from '../configs/manager';
import { EndpointsManagerOptions } from '../mock-endpoints/endpoint-types';
import { EndpointsManager } from '../mock-endpoints/manager';
import { LoaderOptions, LoadersManager } from '../loaders/manager';
import { MiddlewareOptions, MiddlewaresManager } from '../middlewares/manager';
import { RouteOptions, RoutesManager } from '../routes/manager';

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
    loadersOptions?: RouteOptions;
    //
    // Middlewares.
    middlewaresDirectory?: string;
    middlewaresOptions?: RouteOptions;
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
