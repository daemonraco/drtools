/**
 * @file table.ts
 * @author Alejandro D. Simi
 */

import { MySQLRestConditions, MySQLRestConstants, MySQLRestEntry, MySQLRestOrder } from '.';

export class MySQLTable {
    //
    // Protected properties.
    protected _conf: any = false;
    protected _connection: any = null;
    protected _limit: number = null;
    protected _loaded: boolean = false;
    //
    // Constructor.
    constructor(connection: any, conf: any) {
        this._connection = connection;
        this._conf = conf;

        this.load();
    }
    //
    // Public methods.
    public all(conditions: MySQLRestConditions = {}, order: MySQLRestOrder = {}, limit: number = null, offset: number = null, full: boolean = false): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (!this._connection) {
                throw `MySQLTable::all() Error: No connection provided.`;
            }

            let query: string = '';
            let queryParams: any[] = [];

            query += `SELECT  * `;
            query += `FROM    ${this._conf.tablePrefix}${this._conf.name} `;
            query += `WHERE   1 = 1 `;
            //
            // Conditions
            if (!conditions || typeof conditions !== 'object' || Array.isArray(conditions)) {
                conditions = {};
            }
            for (const key in conditions) {
                query += ` AND    ${this._conf.prefix}${key} LIKE ? `;
                queryParams.push(conditions[key]);
            }
            //
            // Order
            const orderPieces = [];
            if (!order || typeof order !== 'object' || Array.isArray(order)) {
                order = {};
            }
            for (const key in order) {
                const way = order[key].toUpperCase();
                if (way == 'ASC' || way == 'DESC') {
                    orderPieces.push(`${this._conf.prefix}${key} ${way}`);
                }
            }
            if (orderPieces.length > 0) {
                query += `ORDER BY ${orderPieces.join(', ')} `;
            }

            limit = typeof limit === 'number' ? limit : null;
            if (!limit || limit < 0) {
                if (this._limit !== null) {
                    limit = this._limit;
                }
            }
            offset = typeof offset === 'number' ? offset : null;
            if (!offset || offset < 1) {
                offset = 0;
            }

            if (limit) {
                queryParams.push(limit);
                query += `LIMIT ? `;
            }

            if (limit && offset >= 0) {
                queryParams.push(offset);
                query += `OFFSET ? `;
            }

            this._connection.query(query, queryParams, (error: any, results: any, fields: any) => {
                if (error) {
                    reject(`${error}`);
                } else {
                    const data = [];
                    for (const entry of results) {
                        data.push(this.cleanEntry(entry));
                    }

                    resolve(full ? {
                        count: data.length,
                        data, conditions, limit, offset, order
                    } : data);
                }
            });
        });
    }
    public count(conditions: MySQLRestConditions = {}, full: boolean = false): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (!this._connection) {
                throw `MySQLTable::count() Error: No connection provided.`;
            }

            let query: string = '';
            let queryParams: any[] = [];

            query += `SELECT  COUNT(*) as c `;
            query += `FROM    ${this._conf.tablePrefix}${this._conf.name} `;
            query += `WHERE   1 = 1 `;

            if (!conditions || typeof conditions !== 'object' || Array.isArray(conditions)) {
                conditions = {};
            }
            for (const key in conditions) {
                query += ` AND    ${this._conf.prefix}${key} LIKE ? `;
                queryParams.push(conditions[key]);
            }

            this._connection.query(query, queryParams, (error: any, results: any, fields: any) => {
                if (error) {
                    reject(`${error}`);
                } else {
                    let count = 0;
                    try { count = results[0].c; } catch (e) { }

                    resolve(full ? { count, conditions } : count);
                }
            });
        });
    }
    public delete(id: string | number): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (!this._connection) {
                throw `MySQLTable::delete() Error: No connection provided.`;
            }

            let query: string = '';

            query += `DELETE FROM ${this._conf.tablePrefix}${this._conf.name} `;
            query += `WHERE       ${this._conf.prefix}id = ? `;

            this._connection.query(query, [id], (error: any, results: any, fields: any) => {
                if (error) {
                    reject(`${error}`);
                } else {
                    resolve(results);
                }
            });
        });
    }
    public get(id: string | number): Promise<MySQLRestEntry> {
        return new Promise<MySQLRestEntry>((resolve: (res: MySQLRestEntry) => void, reject: (err: string) => void) => {
            if (!this._connection) {
                throw `MySQLTable::get() Error: No connection provided.`;
            }

            let query: string = '';

            query += `SELECT  * `;
            query += `FROM    ${this._conf.tablePrefix}${this._conf.name} `;
            query += `WHERE   ${this._conf.prefix}id = ? `;

            this._connection.query(query, [id], (error: any, results: any, fields: any) => {
                if (error) {
                    reject(`${error}`);
                } else {
                    if (results.length === 1) {
                        resolve(this.cleanEntry(results[0]));
                    } else {
                        reject(`Unknown id '${id}'`);
                    }
                }
            });
        });
    }
    public insert(data: any): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (!this._connection) {
                throw `MySQLTable::insert() Error: No connection provided.`;
            }

            if (typeof data === 'object') {
                let query: string = '';
                let queryParams: any[] = [];

                query += `INSERT INTO ${this._conf.tablePrefix}${this._conf.name}`;

                const fields: string[] = [];
                const values: string[] = [];
                for (const key in data) {
                    if (key !== 'id') {
                        fields.push(`${this._conf.prefix}${key}`);
                        values.push(`?`);
                        queryParams.push(data[key]);
                    }
                }
                query += `(${fields.join(', ')}) `;
                query += `VALUES(${values.join(', ')}) `;

                this._connection.query(query, queryParams, (error: any, results: any, fields: any) => {
                    if (error) {
                        reject(`${error}`);
                    } else {
                        resolve(results);
                    }
                });
            } else {
                reject(`Given data is not an object`);
            }
        });
    }
    public update(id: string | number, data: any): Promise<any> {
        return new Promise<any>((resolve: (res: any) => void, reject: (err: string) => void) => {
            if (!this._connection) {
                throw `MySQLTable::update() Error: No connection provided.`;
            }

            if (typeof data === 'object') {
                let query: string = '';
                let queryParams: any[] = [];

                query += `UPDATE ${this._conf.tablePrefix}${this._conf.name} `;

                const setPieces: string[] = [];
                for (const key in data) {
                    if (key !== 'id') {
                        setPieces.push(`${this._conf.prefix}${key} = ?`);
                        queryParams.push(data[key]);
                    }
                }
                query += `SET ${setPieces.join(', ')} `;

                query += `WHERE ${this._conf.prefix}id = ? `;
                queryParams.push(id);

                this._connection.query(query, queryParams, (error: any, results: any, fields: any) => {
                    if (error) {
                        reject(`${error}`);
                    } else {
                        resolve(results);
                    }
                });
            } else {
                reject(`Given data is not an object`);
            }
        });
    }
    //
    // Protected methods.
    protected cleanEntry(entry: MySQLRestEntry): MySQLRestEntry {
        const out: MySQLRestEntry = {};

        const prefixPattern: RegExp = new RegExp(`^${this._conf.prefix}`);
        for (const key in entry) {
            out[key.replace(prefixPattern, '')] = entry[key];
        }

        return out;
    }
    protected load(): void {
        if (!this._loaded) {
            this._loaded = true;
        }
    }
}
