/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
import { ConfigOptions, ConfigsManager } from '../configs/manager';
import { EndpointsManagerOptions } from '../mock-endpoints/endpoint-types';
import { EndpointsManager } from '../mock-endpoints/manager';
import { LoadersManager } from '../loaders/manager';
import { MiddlewaresManager } from '../middlewares/manager';
import { RouteOptions, RoutesManager } from '../routes/manager';
export declare type ExpressMiddleware = (res: any, req: any, next: () => void) => void;
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
    endpoints: EndpointsManagerOptions | EndpointsManagerOptions[];
    verbose?: boolean;
}
export interface ExpressConnectorAttachResults {
    configs: ConfigsManager;
    endpoints: EndpointsManager[];
    loaders: LoadersManager;
    middlewares: MiddlewaresManager;
    routes: RoutesManager;
}
