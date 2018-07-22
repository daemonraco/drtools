"use strict";
/**
 * @file rest-manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const drcollector_1 = require("../drcollector");
const _1 = require(".");
const includes_1 = require("../includes");
class MySQLRestManager {
    //
    // Constructor
    constructor(connection, conf) {
        //
        // Protected properties.
        this._conf = null;
        this._connection = null;
        this._loaded = false;
        this._tables = {};
        this._connection = connection;
        this._conf = conf;
        this.load();
        drcollector_1.DRCollector.registerMySQLRestManager(this);
    }
    //
    // Public methods.
    config() {
        return includes_1.Tools.DeepCopy(this._conf);
    }
    expose(conf) {
        if (conf && typeof this._tables[conf.name] === 'undefined') {
            if (typeof conf.tablePrefix !== 'string') {
                conf.tablePrefix = this._conf.tablePrefix;
            }
            this._conf.expose.push(conf);
            this._tables[conf.name] = new _1.MySQLRestTable(this._connection, conf);
        }
        else if (!conf) {
            throw `No configuration given`;
        }
        else {
            throw `Table '${conf.tablePrefix}${conf.name}' is already exposed`;
        }
    }
    middleware() {
        return (req, res, next) => {
            if (req._parsedUrl.pathname.indexOf(this._conf.uri) === 0) {
                let pieces = req._parsedUrl.pathname.substr(this._conf.uri.length).split('/');
                pieces.shift();
                let table = pieces.shift();
                if (!table) {
                    res.status(200).json({
                        tables: Object.keys(this._tables)
                    });
                }
                else if (typeof this._tables[table] !== 'undefined') {
                    this._tables[table].solve(req.method, pieces, req.query, req.body)
                        .then(results => res.status(200).json(results))
                        .catch(error => {
                        console.error(`MySQLRestManager::middleware() Error:`, error);
                        res.status(500).json({ error });
                    });
                }
                else {
                    res.status(404).json({
                        error: `Unknown table '${table}'`
                    });
                }
            }
            else {
                next();
            }
        };
    }
    //
    // Protected methods.
    checkParams() {
        if (!this._conf) {
            throw `No configuration given`;
        }
        if (typeof this._conf.uri !== 'undefined') {
            this._conf.uri = `/${this._conf.uri}/`;
            while (this._conf.uri.indexOf('//') > -1) {
                this._conf.uri = this._conf.uri.replace('//', '/');
            }
            this._conf.uri = this._conf.uri.substr(0, this._conf.uri.length - 1);
        }
        else {
            throw `Configuration has no 'uri' parameter`;
        }
        if (typeof this._conf.tablePrefix !== 'string') {
            this._conf.tablePrefix = '';
        }
        const exposeType = typeof this._conf.expose;
        if (exposeType === 'object') {
            if (!Array.isArray(this._conf.expose)) {
                this._conf.expose = [this._conf.expose];
            }
        }
        else {
            this._conf.expose = [];
        }
    }
    load() {
        if (!this._loaded) {
            this._tables = {};
            this.checkParams();
            const exposeList = this._conf.expose;
            this._conf.expose = [];
            for (const expose of exposeList) {
                this.expose(expose);
            }
            this._loaded = true;
        }
    }
}
exports.MySQLRestManager = MySQLRestManager;
