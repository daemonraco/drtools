"use strict";
/**
 * @file endpoint-behaviors.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointBehaviors = void 0;
const libraries_1 = require("../../libraries");
class EndpointBehaviors extends Object {
    //
    // Constructor.
    constructor(endpoint) {
        super();
        //
        // Protected properties.
        this._endpoint = null;
        this._endpoint = endpoint;
    }
    //
    // Basic behaviors.
    endpoint(endpointPath, method = null) {
        let out = undefined;
        const fullPath = libraries_1.path.join(this._endpoint.directory(), `${endpointPath}.json`);
        if (libraries_1.fs.existsSync(fullPath)) {
            out = this._endpoint.responseFor(endpointPath, method, true);
        }
        else {
            const rootPath = this._endpoint.directory();
            const filter = /^(.*)\.json$/i;
            out = libraries_1.glob.sync(fullPath)
                .filter((p) => p.match(filter))
                .filter((p) => p.indexOf(rootPath) === 0)
                .map((p) => p.substr(rootPath.length + 1))
                .map((p) => p.replace(filter, '$1'))
                .map((ep) => this._endpoint.responseFor(ep, method, true));
            if (out.length === 0) {
                out = this._endpoint.responseFor(endpointPath, method);
            }
        }
        return out;
    }
    lorem(params) {
        return params === null ? libraries_1.loremIpsum() : libraries_1.loremIpsum(params);
    }
    randNumber(...args) {
        let max = 100;
        let min = 0;
        let out = 0;
        if (args[0] === null) {
            args = [];
        }
        if (Array.isArray(args[0])) {
            if (args[0].length > 0) {
                max = parseInt(args[0][0]);
            }
            if (args[0].length > 1) {
                min = parseInt(args[0][1]);
            }
        }
        else if (typeof args[0] === 'object') {
            if (typeof args[0].max !== 'undefined') {
                max = parseInt(args[0].max);
            }
            if (typeof args[0].min !== 'undefined') {
                min = parseInt(args[0].min);
            }
        }
        else {
            if (typeof args[0] !== 'undefined') {
                max = parseInt(args[0]);
            }
            if (typeof args[1] !== 'undefined') {
                min = parseInt(args[1]);
            }
        }
        if (min > max) {
            let aux = max;
            max = min;
            min = aux;
        }
        out = Math.floor(Math.random() * (max - min + 1)) + min;
        return out;
    }
    randString(length = null) {
        if (length === null) {
            length = 10;
        }
        let out = '';
        while (out.length < length) {
            out += Math.random().toString(36).substring(7);
        }
        return out.substr(0, length);
    }
    //
    // Public methods.
    importBehaviors(behaviors) {
        if (behaviors && typeof behaviors === 'object' && !Array.isArray(behaviors)) {
            Object.keys(behaviors).forEach((key) => {
                if (EndpointBehaviors._PrivateBehaviors.indexOf(key) < 0 && typeof behaviors[key] !== 'undefined') {
                    this[key] = behaviors[key];
                }
            });
        }
    }
}
exports.EndpointBehaviors = EndpointBehaviors;
//
// Protected class properties.
EndpointBehaviors._PrivateBehaviors = [
    'importBehaviors'
];
