/**
 * @file koa.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IKoaConnectorOptions } from '.';
export declare class KoaConnector {
    private static _Instance;
    protected _attached: boolean;
    protected _koaApp: any;
    protected _options: IKoaConnectorOptions;
    protected _uiAttached: boolean;
    private constructor();
    attach(app: any, options: IKoaConnectorOptions): void;
    protected attachConfigsManager(manager: ConfigsManager): void;
    protected attachWebUI(): void;
    static Instance(): KoaConnector;
}
