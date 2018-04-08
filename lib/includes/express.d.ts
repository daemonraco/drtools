import { ConfigsManager } from '../configs/manager';
import { RoutesManager } from '../routes/manager';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from './express-types';
export declare class ExpressConnector {
    private static _Instance;
    private constructor();
    attach(app: any, options?: ExpressConnectorOptions): ExpressConnectorAttachResults;
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager;
    protected attachRoutes(app: any, options: ExpressConnectorOptions): RoutesManager;
    static Instance(): ExpressConnector;
}
