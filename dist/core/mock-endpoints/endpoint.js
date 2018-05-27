"use strict";
/**
 * @file endpoint.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
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
        this.fixConstructorParams();
        this.load();
    }
    //
    // Public methods.
    paths() {
        const out = [];
        this.loadAllEndpoints();
        Object.keys(this._loadedEndpoints).sort().forEach((path) => {
            const brieves = this._loadedEndpoints[path].brievesByMethod();
            Object.keys(brieves).forEach((method) => {
                out.push(brieves[method]);
            });
        });
        return out;
    }
    directory() {
        return this._dirPath;
    }
    expressMiddleware() {
        return (req, res, next) => {
            const match = req.url.match(this._restPattern);
            if (match) {
                const result = this.responseFor(match[2], req.method);
                res.header('Content-Type', 'application/json');
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
    responseFor(endpoint, method, simple = false) {
        let out = {
            status: 200,
            message: null,
            data: {}
        };
        this.loadEndpoint(endpoint);
        out = this._loadedEndpoints[endpoint].data(method);
        return simple ? out.data : out;
    }
    uri() {
        return this._restPath;
    }
    //
    // Protected methods.
    fixConstructorParams() {
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
        const uriForPattern = this._restPath.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}
        this._restPattern = new RegExp(`^${uriForPattern}([\\/]?)(.*)$`);
        //
        // Fixing options.
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        }
        else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    load() {
        if (!this._loaded) {
            this._loaded = true;
            let stat = null;
            try {
                stat = libraries_1.fs.statSync(this._dirPath);
            }
            catch (e) { }
            if (stat && stat.isDirectory()) {
                this._dirPath = libraries_1.path.resolve(this._dirPath);
            }
            else if (stat && !stat.isDirectory()) {
                throw `Path '${this._dirPath}' is not a directory.`;
            }
            else {
                throw `Path '${this._dirPath}' is not a valid path.`;
            }
        }
    }
    loadAllEndpoints() {
        const paths = libraries_1.glob.sync(libraries_1.path.join(this.directory(), '**/*.json'));
        const directoryLength = this.directory().length;
        let uris = [];
        paths.forEach((p) => {
            const matches = p.match(_1.EndpointPathPattern);
            if (matches) {
                let uri;
                if (matches[2] === '_METHODS') {
                    uris.push(matches[4]);
                }
                else {
                    uris.push(p.substr(directoryLength + 1).replace(/\.json$/, ''));
                }
            }
        });
        uris.forEach((u) => {
            this.loadEndpoint(u);
        });
    }
    loadEndpoint(endpoint) {
        if (typeof this._loadedEndpoints[endpoint] === 'undefined') {
            this._loadedEndpoints[endpoint] = new _1.EndpointData(this, endpoint, this._options);
        }
    }
}
exports.Endpoint = Endpoint;
