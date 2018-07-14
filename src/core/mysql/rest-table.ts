/**
 * @file rest-table.ts
 * @author Alejandro D. Simi
 */

import { MySQLRestAuthMiddleware, IMySQLRestExposeConfig, MySQLTable, MySQLUrlParams, MySQLUrlPieces } from '.';

export type MySQLRestTableList = { [name: string]: MySQLRestTable };

export class MySQLRestTable {
    //
    // Protected properties.
    protected _conf: IMySQLRestExposeConfig = null;
    protected _connection: any = null;
    protected _loaded: boolean = false;
    protected _table: MySQLTable = null;
    //
    // Constructor.
    constructor(connection: any, conf: IMySQLRestExposeConfig) {
        this._connection = connection;
        this._conf = conf;

        this.load();
    }
    //
    // Public methods.
    public solve(method: string, urlPieces: MySQLUrlPieces, params: MySQLUrlParams, data: any): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            switch (method.toUpperCase()) {
                case 'GET':
                    this.solveGet(urlPieces, params)
                        .then(resolve)
                        .catch(reject);
                    break;
                case 'POST':
                    this.solvePost(urlPieces, params, data)
                        .then(resolve)
                        .catch(reject);
                    break;
                case 'PUT':
                case 'PATCH':
                    this.solvePut(urlPieces, params, data)
                        .then(resolve)
                        .catch(reject);
                    break;
                case 'DELETE':
                    this.solveDelete(urlPieces, params)
                        .then(resolve)
                        .catch(reject);
                    break;
                default:
                    reject(`Unknown method '${method}' for table '${this._conf.name}'`);
                    break;
            }
        });
    }
    //
    // Protected methods.
    protected checkParams(): void {
        if (typeof this._conf.name === 'undefined') {
            throw `Configuration has no 'name' parameter`;
        }
        if (typeof this._conf.prefix === 'undefined') {
            this._conf.prefix = '';
        }
        if (typeof this._conf.tablePrefix === 'undefined') {
            this._conf.tablePrefix = '';
        }
        if (typeof this._conf.limit === 'undefined') {
            this._conf.limit = null;
        }
    }
    protected load(): void {
        if (!this._loaded) {
            this.checkParams();
            this._table = new MySQLTable(this._connection, this._conf);

            this._loaded = true;
        }
    }
    protected solveDelete(urlPieces: MySQLUrlPieces, params: MySQLUrlParams): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (typeof urlPieces[0] === 'undefined') {
                reject(`No ID given`);
            } else {
                this._table.delete(urlPieces[0])
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    protected solveGet(urlPieces: MySQLUrlPieces, params: MySQLUrlParams): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (typeof urlPieces[0] !== 'undefined') {
                switch (urlPieces[0]) {
                    case '$count':
                        let full: boolean = typeof params.full !== 'undefined';
                        let query: any = null;

                        try { query = JSON.parse(params.query); } catch (e) { }

                        this._table.count(query, full)
                            .then(resolve)
                            .catch(reject);
                        break;
                    default:
                        this._table.get(urlPieces[0])
                            .then(resolve)
                            .catch(reject);
                }
            } else {
                let full: boolean = typeof params.full !== 'undefined';
                let limit: number = typeof params.limit !== 'undefined' ? parseInt(params.limit) : null;
                let offset: number = typeof params.offset !== 'undefined' ? parseInt(params.offset) : null;
                let order: any = null;
                let query: any = null;

                try { query = JSON.parse(params.query); } catch (e) { }
                try { order = JSON.parse(params.order); } catch (e) { }

                this._table.all(query, order, limit, offset, full)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    protected solvePost(urlPieces: MySQLUrlPieces, params: MySQLUrlParams, data: any): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            this._table.insert(data)
                .then(resolve)
                .catch(reject);
        });
    }
    protected solvePut(urlPieces: MySQLUrlPieces, params: MySQLUrlParams, data: any): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (typeof urlPieces[0] === 'undefined') {
                reject(`No ID given`);
            } else {
                this._table.update(urlPieces[0], data)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
}
