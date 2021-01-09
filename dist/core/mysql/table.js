"use strict";
/**
 * @file table.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLTable = void 0;
class MySQLTable {
    //
    // Constructor.
    constructor(connection, conf) {
        //
        // Protected properties.
        this._conf = false;
        this._connection = null;
        this._limit = null;
        this._loaded = false;
        this._connection = connection;
        this._conf = conf;
        this.load();
    }
    //
    // Public methods.
    all(conditions = {}, order = {}, limit = null, offset = null, full = false) {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                throw `MySQLTable::all() Error: No connection provided.`;
            }
            let query = '';
            let queryParams = [];
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
            this._connection.query(query, queryParams, (error, results, fields) => {
                if (error) {
                    reject(`${error}`);
                }
                else {
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
    count(conditions = {}, full = false) {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                throw `MySQLTable::count() Error: No connection provided.`;
            }
            let query = '';
            let queryParams = [];
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
            this._connection.query(query, queryParams, (error, results, fields) => {
                if (error) {
                    reject(`${error}`);
                }
                else {
                    let count = 0;
                    try {
                        count = results[0].c;
                    }
                    catch (e) { }
                    resolve(full ? { count, conditions } : count);
                }
            });
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                throw `MySQLTable::delete() Error: No connection provided.`;
            }
            let query = '';
            query += `DELETE FROM ${this._conf.tablePrefix}${this._conf.name} `;
            query += `WHERE       ${this._conf.prefix}id = ? `;
            this._connection.query(query, [id], (error, results, fields) => {
                if (error) {
                    reject(`${error}`);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    get(id) {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                throw `MySQLTable::get() Error: No connection provided.`;
            }
            let query = '';
            query += `SELECT  * `;
            query += `FROM    ${this._conf.tablePrefix}${this._conf.name} `;
            query += `WHERE   ${this._conf.prefix}id = ? `;
            this._connection.query(query, [id], (error, results, fields) => {
                if (error) {
                    reject(`${error}`);
                }
                else {
                    if (results.length === 1) {
                        resolve(this.cleanEntry(results[0]));
                    }
                    else {
                        reject(`Unknown id '${id}'`);
                    }
                }
            });
        });
    }
    insert(data) {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                throw `MySQLTable::insert() Error: No connection provided.`;
            }
            if (typeof data === 'object') {
                let query = '';
                let queryParams = [];
                query += `INSERT INTO ${this._conf.tablePrefix}${this._conf.name}`;
                const fields = [];
                const values = [];
                for (const key in data) {
                    if (key !== 'id') {
                        fields.push(`${this._conf.prefix}${key}`);
                        values.push(`?`);
                        queryParams.push(data[key]);
                    }
                }
                query += `(${fields.join(', ')}) `;
                query += `VALUES(${values.join(', ')}) `;
                this._connection.query(query, queryParams, (error, results, fields) => {
                    if (error) {
                        reject(`${error}`);
                    }
                    else {
                        resolve(results);
                    }
                });
            }
            else {
                reject(`Given data is not an object`);
            }
        });
    }
    update(id, data) {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                throw `MySQLTable::update() Error: No connection provided.`;
            }
            if (typeof data === 'object') {
                let query = '';
                let queryParams = [];
                query += `UPDATE ${this._conf.tablePrefix}${this._conf.name} `;
                const setPieces = [];
                for (const key in data) {
                    if (key !== 'id') {
                        setPieces.push(`${this._conf.prefix}${key} = ?`);
                        queryParams.push(data[key]);
                    }
                }
                query += `SET ${setPieces.join(', ')} `;
                query += `WHERE ${this._conf.prefix}id = ? `;
                queryParams.push(id);
                this._connection.query(query, queryParams, (error, results, fields) => {
                    if (error) {
                        reject(`${error}`);
                    }
                    else {
                        resolve(results);
                    }
                });
            }
            else {
                reject(`Given data is not an object`);
            }
        });
    }
    //
    // Protected methods.
    cleanEntry(entry) {
        const out = {};
        const prefixPattern = new RegExp(`^${this._conf.prefix}`);
        for (const key in entry) {
            out[key.replace(prefixPattern, '')] = entry[key];
        }
        return out;
    }
    load() {
        if (!this._loaded) {
            this._loaded = true;
        }
    }
}
exports.MySQLTable = MySQLTable;
