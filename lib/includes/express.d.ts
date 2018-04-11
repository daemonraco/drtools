import { ConfigsManager } from '../configs/manager';
import { EndpointsManager } from '../mock-endpoints/manager';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from './express-types';
import { LoadersManager } from '../loaders/manager';
import { MiddlewaresManager } from '../middlewares/manager';
import { RoutesManager } from '../routes/manager';
export declare class ExpressConnector {
    private static _Instance;
    private constructor();
    attach(app: any, options?: ExpressConnectorOptions): ExpressConnectorAttachResults;
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager;
    protected attachLoaders(options: ExpressConnectorOptions, configs: ConfigsManager): LoadersManager;
    protected attachMiddlewares(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MiddlewaresManager;
    protected attachMockEndpoints(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): EndpointsManager[];
    protected attachRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): RoutesManager;
    static Instance(): ExpressConnector;
}
