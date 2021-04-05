"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointBehaviors = void 0;
const tslib_1 = require("tslib");
const lorem_ipsum_1 = require("lorem-ipsum");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const glob_1 = tslib_1.__importDefault(require("glob"));
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
    endpoint(endpointPath, method) {
        let out = undefined;
        const fullPath = path.join(this._endpoint.directory(), `${endpointPath}.json`);
        if (fs.existsSync(fullPath)) {
            out = this._endpoint.responseFor(endpointPath, method, true);
        }
        else {
            const rootPath = this._endpoint.directory();
            const filter = /^(.*)\.json$/i;
            out = glob_1.default.sync(fullPath)
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
        return params === null ? lorem_ipsum_1.loremIpsum() : lorem_ipsum_1.loremIpsum(params);
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
            if (args[0].max !== undefined) {
                max = parseInt(args[0].max);
            }
            if (args[0].min !== undefined) {
                min = parseInt(args[0].min);
            }
        }
        else {
            if (args[0] !== undefined) {
                max = parseInt(args[0]);
            }
            if (args[1] !== undefined) {
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
    randString(length = 10) {
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
                if (EndpointBehaviors._PrivateBehaviors.indexOf(key) < 0 && behaviors[key] !== undefined) {
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
