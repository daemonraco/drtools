/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
import { ConfigOptions, ConfigsManager } from '../configs/manager';
import { LoadersManager } from '../loaders/manager';
import { MiddlewaresManager } from '../middlewares/manager';
import { RouteOptions, RoutesManager } from '../routes/manager';
export interface ExpressConnectorOptions {
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    loadersDirectory?: string;
    loadersOptions?: RouteOptions;
    middlewaresDirectory?: string;
    middlewaresOptions?: RouteOptions;
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    verbose?: boolean;
}
export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    routes: RoutesManager;
}
