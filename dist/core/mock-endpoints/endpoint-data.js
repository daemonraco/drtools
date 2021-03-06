"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointData = void 0;
const tslib_1 = require("tslib");
/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
const _1 = require(".");
const _2 = require(".");
const includes_1 = require("../includes");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const glob_1 = tslib_1.__importDefault(require("glob"));
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
        this._briefByMethod = {};
        this._endpoint = null;
        this._exists = false;
        this._options = {};
        this._raw = {};
        this._uri = '';
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
    briefByMethod() {
        return this._briefByMethod;
    }
    data(method) {
        let out = {
            status: 404,
            message: `Not found.`,
            data: {}
        };
        if (this._exists) {
            method = method ? method.toLowerCase() : undefined;
            if (this._raw['*'] !== undefined) {
                method = '*';
            }
            if (method && this._raw[method] !== undefined) {
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
    /* istanbul ignore next */
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
                let params = match[3] !== undefined ? match[3] : null;
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
    /* istanbul ignore next */
    fixOptions() {
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        }
        else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    /* istanbul ignore next */
    loadBehaviors() {
        const behaviorsPath = path.join(this._endpoint.directory(), `${this._uri}.js`);
        if (fs.existsSync(behaviorsPath)) {
            try {
                const extraBehaviors = require(behaviorsPath);
                this._behaviors.importBehaviors(extraBehaviors);
                Object.keys(this._briefByMethod).forEach((method) => this._briefByMethod[method].behaviors = true);
            }
            catch (e) { }
        }
        this.loadGlobalBehaviors();
    }
    /* istanbul ignore next */
    loadGlobalBehaviors() {
        this._options.globalBehaviors.forEach((globalBehaviorsPath) => {
            try {
                const globalBehaviors = require(globalBehaviorsPath);
                this._behaviors.importBehaviors(globalBehaviors);
            }
            catch (e) { }
        });
    }
    /* istanbul ignore next */
    loadPaths() {
        const basicPath = path.join(this._endpoint.directory(), `${this._uri}.json`);
        const byMethodPattern = path.join(this._endpoint.directory(), `_METHODS/*/${this._uri}.json`);
        const byMethodPaths = glob_1.default.sync(byMethodPattern);
        if (byMethodPaths.length) {
            this._exists = true;
            byMethodPaths.forEach((p) => {
                const matches = p.match(_2.EndpointPathPattern);
                if (matches) {
                    this._briefByMethod[matches[3]] = {
                        behaviors: false,
                        method: matches[3],
                        path: p,
                        uri: this._uri
                    };
                }
            });
        }
        else if (fs.existsSync(basicPath)) {
            this._exists = true;
            this._briefByMethod['*'] = {
                behaviors: false,
                path: basicPath,
                uri: this._uri
            };
        }
    }
    /* istanbul ignore next */
    loadRaw() {
        for (const method of Object.keys(this._briefByMethod)) {
            this._raw[method] = fs.readFileSync(this._briefByMethod[method].path).toString();
            try {
                this._raw[method] = JSON.parse(this._raw[method]);
            }
            catch (e) { }
        }
    }
}
exports.EndpointData = EndpointData;
