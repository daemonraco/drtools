/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */

import { fs, glob, path } from '../../libraries';

import { Endpoint, EndpointBehaviors, EndpointBrief, EndpointBrievesByMethod } from '.';
import { EndpointOptions, EndpointPathPattern, EndpointRawByMethod } from '.';
import { Tools } from '../includes';

export class EndpointData {
    //
    // Constants.
    readonly BehaviorPattern = /^@@([a-z_0-9]+)(|:(.*))$/i;
    //
    // Protected properties.
    protected _behaviors: EndpointBehaviors = null;
    protected _brievesByMethod: EndpointBrievesByMethod = {};
    protected _endpoint: Endpoint = null;
    protected _exists: boolean = false;
    protected _options: EndpointOptions = {};
    protected _raw: EndpointRawByMethod = {};
    protected _uri: string = null;
    //
    // Constructor.
    constructor(endpoint: Endpoint, uri: string, options: EndpointOptions = {}) {
        this._endpoint = endpoint;
        this._uri = uri;
        this._options = Tools.DeepMergeObjects(this._options, options);
        this.fixOptions();

        this.loadPaths();
        this.loadRaw();

        this._behaviors = new EndpointBehaviors(this._endpoint);
        this.loadBehaviors();
    }
    //
    // Public methods.
    public brievesByMethod(): EndpointBrievesByMethod {
        return this._brievesByMethod;
    }
    public data(method: string = null): any {
        let out: any = {
            status: 404,
            message: `Not found.`,
            data: {}
        };

        if (this._exists) {
            method = method ? method.toLowerCase() : null;
            if (typeof this._raw['*'] !== 'undefined') {
                method = '*';
            }

            if (typeof this._raw[method] !== 'undefined') {
                try {
                    out.data = JSON.parse(JSON.stringify(this._raw[method]));
                    out.data = this.expanded(out.data);

                    out.status = 200;
                    out.message = null;
                } catch (e) {
                    out.status = 500;
                    out.message = `Error loading specs. ${e}`;
                    out.data = e;
                }
            } else {
                out.status = 400;
                out.message = `Bad Request.`;
            }
        }

        return out;
    }
    //
    // Protected methods.
    protected expanded(out: any): any {
        const outType = typeof out;

        if (Array.isArray(out)) {
            for (let i = out.length - 1; i >= 0; i--) {
                out[i] = this.expanded(out[i]);
            }
        } else if (outType === 'object') {
            Object.keys(out).forEach(key => {
                out[key] = this.expanded(out[key]);
            });
        } else if (outType === 'string') {
            const match = out.match(this.BehaviorPattern);
            if (match) {
                const behavior = match[1];
                let params = typeof match[3] !== 'undefined' ? match[3] : null;
                try { params = JSON.parse(match[3]); } catch (e) { }

                const func = this._behaviors[behavior];
                if (typeof func === 'function') {
                    out = func.apply(this._behaviors, Array.isArray(params) ? params : [params]);
                } else {
                    throw `Unknown behavior '${behavior}'.`;
                }
            }
        }

        return out;
    }
    protected fixOptions(): void {
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        } else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    protected loadBehaviors(): void {
        const behaviorsPath: string = path.join(this._endpoint.directory(), `${this._uri}.js`);

        if (fs.existsSync(behaviorsPath)) {
            try {
                const extraBehaviors = require(behaviorsPath);
                this._behaviors.importBehaviors(extraBehaviors);

                Object.keys(this._brievesByMethod).forEach((method: string) => this._brievesByMethod[method].behaviors = true);
            } catch (e) { }
        }

        this.loadGlobalBehaviors();
    }
    protected loadGlobalBehaviors(): void {
        (<string[]>this._options.globalBehaviors).forEach((globalBehaviorsPath: string): void => {
            try {
                const globalBehaviors = require(globalBehaviorsPath);
                this._behaviors.importBehaviors(globalBehaviors);
            } catch (e) {
            }
        });
    }
    protected loadPaths(): void {
        const basicPath: string = path.join(this._endpoint.directory(), `${this._uri}.json`);
        const byMethodPattern: string = path.join(this._endpoint.directory(), `_METHODS/*/${this._uri}.json`);
        const byMethodPaths: string[] = glob.sync(byMethodPattern);

        if (byMethodPaths.length) {
            this._exists = true;

            byMethodPaths.forEach((p: string) => {
                const matches: string[] = p.match(EndpointPathPattern);
                if (matches) {
                    this._brievesByMethod[matches[3]] = {
                        behaviors: false,
                        method: matches[3],
                        path: p,
                        uri: this._uri
                    };
                }
            });
        } else if (fs.existsSync(basicPath)) {
            this._exists = true;

            this._brievesByMethod['*'] = {
                behaviors: false,
                method: null,
                path: basicPath,
                uri: this._uri
            };
        }
    }
    protected loadRaw(): void {
        Object.keys(this._brievesByMethod).forEach((method: string) => {
            this._raw[method] = fs.readFileSync(this._brievesByMethod[method].path).toString();

            try {
                this._raw[method] = JSON.parse(this._raw[method]);
            } catch (e) { }
        });
    }
}
