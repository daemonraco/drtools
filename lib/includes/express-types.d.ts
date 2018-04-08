/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager, ConfigOptions } from '../configs/manager';
import { RouteOptions, RoutesManager } from '../routes/manager';
export interface ExpressConnectorOptions {
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
    routesDirectory?: string;
    routesOptions?: RouteOptions;
}
export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    routes: RoutesManager;
}
