/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { ExpressConnectorOptions } from '.';
export declare class ExpressConnector {
    private static _Instance;
    protected _attached: boolean;
    protected _expressApp: any;
    protected _options: ExpressConnectorOptions;
    protected _uiAttached: boolean;
    private constructor();
    attach(app: any, options: ExpressConnectorOptions): void;
    protected attachConfigsManager(manager: ConfigsManager): void;
    protected attachWebUI(app: any, options: ExpressConnectorOptions): void;
    static Instance(): ExpressConnector;
}
