/**
 * @file rest-table.ts
 * @author Alejandro D. Simi
 */
import { IMySQLRestExposeConfig, MySQLTable, MySQLUrlParams, MySQLUrlPieces } from '.';
export declare type MySQLRestTableList = {
    [name: string]: MySQLRestTable;
};
export declare class MySQLRestTable {
    protected _conf: IMySQLRestExposeConfig;
    protected _connection: any;
    protected _loaded: boolean;
    protected _table: MySQLTable;
    constructor(connection: any, conf: IMySQLRestExposeConfig);
    solve(method: string, urlPieces: MySQLUrlPieces, params: MySQLUrlParams, data: any): Promise<any>;
    protected checkParams(): void;
    protected load(): void;
    protected solveDelete(urlPieces: MySQLUrlPieces, params: MySQLUrlParams): Promise<any>;
    protected solveGet(urlPieces: MySQLUrlPieces, params: MySQLUrlParams): Promise<any>;
    protected solvePost(urlPieces: MySQLUrlPieces, params: MySQLUrlParams, data: any): Promise<any>;
    protected solvePut(urlPieces: MySQLUrlPieces, params: MySQLUrlParams, data: any): Promise<any>;
}
