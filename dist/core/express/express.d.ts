/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IExpressConnectorOptions } from '.';
export declare class ExpressConnector {
    private static _Instance;
    protected _attached: boolean;
    protected _expressApp: any;
    protected _options: IExpressConnectorOptions;
    protected _uiAttached: boolean;
    private constructor();
    attach(app: any, options: IExpressConnectorOptions): void;
    protected attachConfigsManager(manager: ConfigsManager): void;
    protected attachWebUI(app: any, options: IExpressConnectorOptions): void;
    static Instance(): ExpressConnector;
}
