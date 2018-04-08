/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
import { ConfigOptions, ConfigsManager } from '../configs/manager';
import { MiddlewaresManager } from '../middlewares/manager';
import { RouteOptions, RoutesManager } from '../routes/manager';
export interface ExpressConnectorOptions {
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    middlewaresDirectory?: string;
    middlewaresOptions?: RouteOptions;
    routesDirectory?: string;
    routesOptions?: RouteOptions;
    verbose?: boolean;
}
export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    middlewares: MiddlewaresManager;
    routes: RoutesManager;
}
