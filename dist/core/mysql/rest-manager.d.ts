/**
 * @file rest-manager.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
import { MySQLRestExposeConfig, MySQLRestManagerConfig, MySQLRestTableList } from '.';
export declare class MySQLRestManager {
    protected _conf: MySQLRestManagerConfig;
    protected _connection: any;
    protected _loaded: boolean;
    protected _tables: MySQLRestTableList;
    constructor(connection: any, conf: MySQLRestManagerConfig);
    config(): MySQLRestManagerConfig;
    expose(conf: MySQLRestExposeConfig): void;
    middleware(): ExpressMiddleware;
    protected checkParams(): void;
    protected load(): void;
}
