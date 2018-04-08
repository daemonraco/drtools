import { ConfigsManager } from '../configs/manager';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from './express-types';
export declare class ExpressConnector {
    private static _Instance;
    private constructor();
    attach(app: any, options?: ExpressConnectorOptions): ExpressConnectorAttachResults;
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager;
    static Instance(): ExpressConnector;
}
