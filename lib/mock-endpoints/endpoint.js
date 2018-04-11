"use strict";
/**
 * @file endpoint.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const _1 = require(".");
class Endpoint {
    //
    // Constructor.
    constructor(dirPath, restPath, options = {}) {
        //
        // Protected properties.
        this._dirPath = '';
        this._loaded = false;
        this._loadedEndpoints = {};
        this._restPath = '';
        this._restPattern = null;
        this._options = null;
        this._dirPath = dirPath;
        this._restPath = restPath;
        this._options = options;
        this.fixOptions();
        this.load();
    }
    //
    // Public methods.
    expressMiddleware() {
        return (req, res, next) => {
            const match = req.url.match(this._restPattern);
            if (match) {
                const result = this.genResponseFor(match[2]);
                if (result.status === 200) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(result.status).json({
                        status: result.status,
                        message: result.message,
                        data: result.data
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
    fixOptions() {
        //
        // Cleaning URI @{
        this._restPath = `/${this._restPath}/`;
        [
            ['//', '/']
        ].forEach((pair) => {
            while (this._restPath.indexOf(pair[0]) > -1) {
                this._restPath = this._restPath.replace(pair[0], pair[1]);
            }
        });
        this._restPath = this._restPath.substr(0, this._restPath.length - 1);
        this._restPath = this._restPath.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}
        this._restPattern = new RegExp(`^${this._restPath}([\\/]?)(.*)$`);
    }
    genResponseFor(endpoint) {
        let out = {
            status: 200,
            message: null,
            data: {}
        };
        const endpointPath = path.join(this._dirPath, `${endpoint}.json`);
        if (typeof this._loadedEndpoints[endpointPath] === 'undefined') {
            let stat = null;
            try {
                stat = fs.statSync(endpointPath);
            }
            catch (e) { }
            ;
            if (stat && stat.isFile()) {
                try {
                    this._loadedEndpoints[endpointPath] = new _1.EndpointData(endpointPath, this._options);
                    out.data = this._loadedEndpoints[endpointPath].data();
                }
                catch (e) {
                    out.status = 500;
                    out.message = `Error loading specs. ${e}`;
                }
                ;
            }
            else {
                out.status = 404;
                out.message = `Endpoint '${endpoint}' was not found.`;
                out.data = {};
            }
        }
        else {
            out.data = this._loadedEndpoints[endpointPath].data();
        }
        return out;
    }
    load() {
        if (!this._loaded) {
            this._loaded = true;
            let stat = null;
            try {
                stat = fs.statSync(this._dirPath);
            }
            catch (e) { }
            if (stat && stat.isDirectory()) {
                /// @todo should I do something when it's a success?
            }
            else if (stat && !stat.isDirectory()) {
                throw `Path '${this._dirPath}' is not a directory.`;
            }
            else {
                throw `Path '${this._dirPath}' is not a valid path.`;
            }
        }
    }
}
exports.Endpoint = Endpoint;
