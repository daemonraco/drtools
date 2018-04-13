"use strict";
/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const includes_1 = require("../includes");
class EndpointData {
    //
    // Constructor.
    constructor(dummyDataPath, options = {}) {
        //
        // Constants.
        this.BehaviorPattern = /^@@([a-z_0-9]+)(|:(.*))$/i;
        //
        // Protected properties.
        this._behaviors = new _1.EndpointBehaviors();
        this._options = {};
        this._raw = '';
        this._options = includes_1.Tools.DeepMergeObjects(this._options, options);
        this.fixOptions();
        this.loadRaw(dummyDataPath);
        this.loadBehaviors(dummyDataPath);
    }
    //
    // Public methods.
    data() {
        let out = JSON.parse(JSON.stringify(this._raw));
        return this.expanded(out);
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
                    out = func.apply(null, Array.isArray(params) ? params : [params]);
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
    loadBehaviors(dummyDataPath) {
        const dummyBehaviorsPath = dummyDataPath.replace(/\.json$/, '.js');
        try {
            const extraBehaviors = require(dummyBehaviorsPath);
            this._behaviors.importBehaviors(extraBehaviors);
        }
        catch (e) { }
        this.loadGlobalBehaviors();
    }
    loadGlobalBehaviors() {
        this._options.globalBehaviors.forEach((globalBehaviorsPath) => {
            try {
                const globalBehaviors = require(globalBehaviorsPath);
                this._behaviors.importBehaviors(globalBehaviors);
            }
            catch (e) {
            }
        });
    }
    loadRaw(dummyDataPath) {
        const reqData = require(dummyDataPath);
        this._raw = JSON.parse(JSON.stringify(reqData));
    }
}
exports.EndpointData = EndpointData;
