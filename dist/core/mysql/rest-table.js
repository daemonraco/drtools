"use strict";
/**
 * @file rest-table.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MySQLRestTable {
    //
    // Constructor.
    constructor(connection, conf) {
        //
        // Protected properties.
        this._conf = null;
        this._connection = null;
        this._loaded = false;
        this._table = null;
        this._connection = connection;
        this._conf = conf;
        this.load();
    }
    //
    // Public methods.
    solve(method, urlPieces, params, data) {
        return new Promise((resolve, reject) => {
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
    checkParams() {
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
    load() {
        if (!this._loaded) {
            this.checkParams();
            this._table = new _1.MySQLTable(this._connection, this._conf);
            this._loaded = true;
        }
    }
    solveDelete(urlPieces, params) {
        return new Promise((resolve, reject) => {
            if (typeof urlPieces[0] === 'undefined') {
                reject(`No ID given`);
            }
            else {
                this._table.delete(urlPieces[0])
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    solveGet(urlPieces, params) {
        return new Promise((resolve, reject) => {
            if (typeof urlPieces[0] !== 'undefined') {
                switch (urlPieces[0]) {
                    case '$count':
                        let full = typeof params.full !== 'undefined';
                        let query = null;
                        try {
                            query = JSON.parse(params.query);
                        }
                        catch (e) { }
                        this._table.count(query, full)
                            .then(resolve)
                            .catch(reject);
                        break;
                    default:
                        this._table.get(urlPieces[0])
                            .then(resolve)
                            .catch(reject);
                }
            }
            else {
                let full = typeof params.full !== 'undefined';
                let limit = typeof params.limit !== 'undefined' ? parseInt(params.limit) : null;
                let offset = typeof params.offset !== 'undefined' ? parseInt(params.offset) : null;
                let order = null;
                let query = null;
                try {
                    query = JSON.parse(params.query);
                }
                catch (e) { }
                try {
                    order = JSON.parse(params.order);
                }
                catch (e) { }
                this._table.all(query, order, limit, offset, full)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    solvePost(urlPieces, params, data) {
        return new Promise((resolve, reject) => {
            this._table.insert(data)
                .then(resolve)
                .catch(reject);
        });
    }
    solvePut(urlPieces, params, data) {
        return new Promise((resolve, reject) => {
            if (typeof urlPieces[0] === 'undefined') {
                reject(`No ID given`);
            }
            else {
                this._table.update(urlPieces[0], data)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
}
exports.MySQLRestTable = MySQLRestTable;
