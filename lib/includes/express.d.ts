import { ConfigsManager } from '../configs/manager';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from './express-types';
import { MiddlewaresManager } from '../middlewares/manager';
import { RoutesManager } from '../routes/manager';
export declare class ExpressConnector {
    private static _Instance;
    private constructor();
    attach(app: any, options?: ExpressConnectorOptions): ExpressConnectorAttachResults;
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager;
    protected attachMiddlewares(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MiddlewaresManager;
    protected attachRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): RoutesManager;
    static Instance(): ExpressConnector;
}
