"use strict";
/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const _1 = require(".");
const _2 = require(".");
const includes_1 = require("../includes");
class EndpointData {
    //
    // Constructor.
    constructor(endpoint, uri, options = {}) {
        //
        // Constants.
        this.BehaviorPattern = /^@@([a-z_0-9]+)(|:(.*))$/i;
        //
        // Protected properties.
        this._behaviors = null;
        this._brievesByMethod = {};
        this._endpoint = null;
        this._exists = false;
        this._options = {};
        this._raw = {};
        this._uri = null;
        this._endpoint = endpoint;
        this._uri = uri;
        this._options = includes_1.Tools.DeepMergeObjects(this._options, options);
        this.fixOptions();
        this.loadPaths();
        this.loadRaw();
        this._behaviors = new _1.EndpointBehaviors(this._endpoint);
        this.loadBehaviors();
    }
    //
    // Public methods.
    brievesByMethod() {
        return this._brievesByMethod;
    }
    data(method = null) {
        let out = {
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
                }
                catch (e) {
                    out.status = 500;
                    out.message = `Error loading specs. ${e}`;
                    out.data = e;
                }
            }
            else {
                out.status = 400;
                out.message = `Bad Request.`;
            }
        }
        return out;
    }
    //
    // Protected methods.
    expanded(out) {
        const outType = typeof out;
        if (Array.isArray(out)) {
            for (let i = out.length - 1; i >= 0; i--) {
                out[i] = this.expanded(out[i]);
            }
        }
        else if (outType === 'object') {
            Object.keys(out).forEach(key => {
                out[key] = this.expanded(out[key]);
            });
        }
        else if (outType === 'string') {
            const match = out.match(this.BehaviorPattern);
            if (match) {
                const behavior = match[1];
                let params = typeof match[3] !== 'undefined' ? match[3] : null;
                try {
                    params = JSON.parse(match[3]);
                }
                catch (e) { }
                const func = this._behaviors[behavior];
                if (typeof func === 'function') {
                    out = func.apply(this._behaviors, Array.isArray(params) ? params : [params]);
                }
                else {
                    throw `Unknown behavior '${behavior}'.`;
                }
            }
        }
        return out;
    }
    fixOptions() {
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        }
        else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    loadBehaviors() {
        const behaviorsPath = libraries_1.path.join(this._endpoint.directory(), `${this._uri}.js`);
        if (libraries_1.fs.existsSync(behaviorsPath)) {
            try {
                const extraBehaviors = require(behaviorsPath);
                this._behaviors.importBehaviors(extraBehaviors);
                Object.keys(this._brievesByMethod).forEach((method) => this._brievesByMethod[method].behaviors = true);
            }
            catch (e) { }
        }
        this.loadGlobalBehaviors();
    }
    loadGlobalBehaviors() {
        this._options.globalBehaviors.forEach((globalBehaviorsPath) => {
            try {
                const globalBehaviors = require(globalBehaviorsPath);
                this._behaviors.importBehaviors(globalBehaviors);
            }
            catch (e) { }
        });
    }
    loadPaths() {
        const basicPath = libraries_1.path.join(this._endpoint.directory(), `${this._uri}.json`);
        const byMethodPattern = libraries_1.path.join(this._endpoint.directory(), `_METHODS/*/${this._uri}.json`);
        const byMethodPaths = libraries_1.glob.sync(byMethodPattern);
        if (byMethodPaths.length) {
            this._exists = true;
            byMethodPaths.forEach((p) => {
                const matches = p.match(_2.EndpointPathPattern);
                if (matches) {
                    this._brievesByMethod[matches[3]] = {
                        behaviors: false,
                        method: matches[3],
                        path: p,
                        uri: this._uri
                    };
                }
            });
        }
        else if (libraries_1.fs.existsSync(basicPath)) {
            this._exists = true;
            this._brievesByMethod['*'] = {
                behaviors: false,
                method: null,
                path: basicPath,
                uri: this._uri
            };
        }
    }
    loadRaw() {
        Object.keys(this._brievesByMethod).forEach((method) => {
            this._raw[method] = libraries_1.fs.readFileSync(this._brievesByMethod[method].path).toString();
            try {
                this._raw[method] = JSON.parse(this._raw[method]);
            }
            catch (e) { }
        });
    }
}
exports.EndpointData = EndpointData;
