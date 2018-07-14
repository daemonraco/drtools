/**
 * @file rest-manager.ts
 * @author Alejandro D. Simi
 */

import { DRCollector } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { IMySQLRestExposeConfig, IMySQLRestManagerConfig, MySQLRestTable, MySQLRestTableList } from '.';
import { Tools } from '../includes';

export class MySQLRestManager {
    //
    // Protected properties.
    protected _conf: IMySQLRestManagerConfig = null;
    protected _connection: any = null;
    protected _loaded: boolean = false;
    protected _tables: MySQLRestTableList = {};
    //
    // Constructor
    public constructor(connection: any, conf: IMySQLRestManagerConfig) {
        this._connection = connection;
        this._conf = conf;

        this.load();

        DRCollector.registerMySQLRestManager(this);
    }
    //
    // Public methods.
    public config(): IMySQLRestManagerConfig {
        return Tools.DeepCopy(this._conf);
    }
    public expose(conf: IMySQLRestExposeConfig): void {
        if (conf && typeof this._tables[conf.name] === 'undefined') {
            if (typeof conf.tablePrefix !== 'string') {
                conf.tablePrefix = this._conf.tablePrefix;
            }

            (<IMySQLRestExposeConfig[]>this._conf.expose).push(conf);
            this._tables[conf.name] = new MySQLRestTable(this._connection, conf);
        } else if (!conf) {
            throw `No configuration given`;
        } else {
            throw `Table '${conf.tablePrefix}${conf.name}' is already exposed`;
        }
    }
    public middleware(): ExpressMiddleware {
        return (req: any, res: any, next: () => void) => {
            if (req._parsedUrl.pathname.indexOf(this._conf.uri) === 0) {
                let pieces: string[] = req._parsedUrl.pathname.substr(this._conf.uri.length).split('/');
                pieces.shift();
                let table: string = pieces.shift();

                if (!table) {
                    res.status(200).json({
                        tables: Object.keys(this._tables)
                    });
                } else if (typeof this._tables[table] !== 'undefined') {
                    this._tables[table].solve(req.method, pieces, req.query, req.body)
                        .then(results => res.status(200).json(results))
                        .catch(error => res.status(500).json({ error }));
                } else {
                    res.status(404).json({
                        error: `Unknown table '${table}'`
                    })
                }
            } else {
                next();
            }
        };
    }
    //
    // Protected methods.
    protected checkParams(): void {
        if (!this._conf) {
            throw `No configuration given`;
        }

        if (typeof this._conf.uri !== 'undefined') {
            this._conf.uri = `/${this._conf.uri}/`;
            while (this._conf.uri.indexOf('//') > -1) {
                this._conf.uri = this._conf.uri.replace('//', '/');
            }
            this._conf.uri = this._conf.uri.substr(0, this._conf.uri.length - 1);
        } else {
            throw `Configuration has no 'uri' parameter`;
        }

        if (typeof this._conf.tablePrefix !== 'string') {
            this._conf.tablePrefix = '';
        }

        const exposeType: any = typeof this._conf.expose;
        if (exposeType === 'object') {
            if (!Array.isArray(this._conf.expose)) {
                this._conf.expose = [this._conf.expose];
            }
        } else {
            this._conf.expose = [];
        }
    }
    protected load(): void {
        if (!this._loaded) {
            this._tables = {};
            this.checkParams();

            const exposeList: IMySQLRestExposeConfig[] = <IMySQLRestExposeConfig[]>this._conf.expose;
            this._conf.expose = [];
            for (const expose of exposeList) {
                this.expose(expose);
            }

            this._loaded = true;
        }
    }
}
