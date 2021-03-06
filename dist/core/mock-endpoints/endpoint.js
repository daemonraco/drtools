"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = void 0;
const tslib_1 = require("tslib");
const _1 = require(".");
const http_status_codes_1 = require("http-status-codes");
const includes_1 = require("../includes");
const path = tslib_1.__importStar(require("path"));
const glob_1 = tslib_1.__importDefault(require("glob"));
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
        this._options = {};
        this._options = options;
        this.cleanOptions();
        this._dirPath = dirPath;
        this._restPath = restPath;
        this.fixConstructorParams();
        this.load();
    }
    //
    // Public methods.
    paths() {
        const out = [];
        this.loadAllEndpoints();
        Object.keys(this._loadedEndpoints).sort().forEach((path) => {
            const brieves = this._loadedEndpoints[path].briefByMethod();
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
                if (result.status === http_status_codes_1.StatusCodes.OK) {
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
    koaMiddleware() {
        return (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const match = ctx.url.match(this._restPattern);
            if (match) {
                const result = this.responseFor(match[2], ctx.method);
                ctx.set('Content-Type', 'application/json');
                if (result.status === http_status_codes_1.StatusCodes.OK) {
                    ctx.body = result.data;
                }
                else {
                    ctx.throw(result.status, {
                        status: result.status,
                        message: result.message,
                        data: result.data
                    });
                }
            }
            else {
                yield next();
            }
        });
    }
    responseFor(endpoint, method, simple = false) {
        let out = {
            status: http_status_codes_1.StatusCodes.OK,
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
    /* istanbul ignore next */
    cleanOptions() {
        //
        // Fixing options.
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        }
        else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    /* istanbul ignore next */
    fixConstructorParams() {
        //
        // Cleaning URI.
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
        this._restPattern = new RegExp(`^${uriForPattern}([\\/]?)(.*)$`);
    }
    /* istanbul ignore next */
    load() {
        if (!this._loaded) {
            this._loaded = true;
            const check = includes_1.Tools.CheckDirectory(this._dirPath, process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._dirPath = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    throw `Path '${this._dirPath}' is not a directory.`;
                default:
                    throw `Path '${this._dirPath}' is not a valid path.`;
            }
        }
    }
    /* istanbul ignore next */
    loadAllEndpoints() {
        const paths = glob_1.default.sync(path.join(this.directory(), '**/*.json'));
        const directoryLength = this.directory().length;
        let uris = [];
        paths.forEach((p) => {
            const matches = p.match(_1.EndpointPathPattern);
            if (matches) {
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
    /* istanbul ignore next */
    loadEndpoint(endpoint) {
        if (this._loadedEndpoints[endpoint] === undefined) {
            this._loadedEndpoints[endpoint] = new _1.EndpointData(this, endpoint, this._options);
        }
    }
}
exports.Endpoint = Endpoint;
