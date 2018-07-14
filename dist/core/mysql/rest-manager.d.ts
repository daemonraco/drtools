/**
 * @file rest-manager.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
import { IMySQLRestExposeConfig, IMySQLRestManagerConfig, MySQLRestTableList } from '.';
export declare class MySQLRestManager {
    protected _conf: IMySQLRestManagerConfig;
    protected _connection: any;
    protected _loaded: boolean;
    protected _tables: MySQLRestTableList;
    constructor(connection: any, conf: IMySQLRestManagerConfig);
    config(): IMySQLRestManagerConfig;
    expose(conf: IMySQLRestExposeConfig): void;
    middleware(): ExpressMiddleware;
    protected checkParams(): void;
    protected load(): void;
}
