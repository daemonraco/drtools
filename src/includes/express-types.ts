/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */

import { ConfigOptions, ConfigsManager } from '../configs/manager';
import { LoaderOptions, LoadersManager } from '../loaders/manager';
import { MiddlewareOptions, MiddlewaresManager } from '../middlewares/manager';
import { RouteOptions, RoutesManager } from '../routes/manager';

export interface ExpressConnectorOptions {
    //
    // Configs.
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    //
    // Loaders
    loadersDirectory?: string;
    loadersOptions?: RouteOptions;
    //
    // Middlewares
    middlewaresDirectory?: string;
    middlewaresOptions?: RouteOptions;
    //
    // Routes.
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    //
    // General
    verbose?: boolean;
}

export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    routes: RoutesManager;
}
