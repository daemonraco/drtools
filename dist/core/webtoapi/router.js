"use strict";
/**
 * @file router.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const types_1 = require("./types");
class WebToApiRouter {
    //
    // Constructor.
    constructor(manager, endpoints, config) {
        //
        // Protected properties.
        this._config = null;
        this._expressRouter = null;
        this._knownPaths = [];
        this._koaRouter = null;
        this._loaded = false;
        this._manager = null;
        this._manager = manager;
        this._endpoints = endpoints;
        this._config = config;
        this.load();
    }
    //
    // Public methods.
    expressRouter() {
        this.buildExpressRouter();
        return this._expressRouter;
    }
    koaRouter() {
        this.buildKoaRouter();
        return this._koaRouter;
    }
    //
    // Protected methods.
    async attendRequest(endpoint, map, url, urlParams, options = {}) {
        const results = {
            body: null,
            status: libraries_1.httpStatusCodes.INTERNAL_SERVER_ERROR,
        };
        const params = {};
        for (const k of Object.keys(map)) {
            if (typeof urlParams[map[k]] !== 'undefined') {
                params[k] = urlParams[map[k]];
            }
        }
        try {
            const res = await this._manager.get(endpoint.name, params);
            results.status = libraries_1.httpStatusCodes.OK;
            results.body = res;
        }
        catch (error) {
            if (options.logErrors) {
                console.error(`Error at '${url}'`, error);
            }
            results.status = libraries_1.httpStatusCodes.INTERNAL_SERVER_ERROR;
            results.body = { error: `${error}` };
        }
        return results;
    }
    buildExpressRouter() {
        if (!this._expressRouter) {
            this._expressRouter = libraries_1.express.Router();
            for (const route of this._config.routes) {
                if (typeof this._endpoints[route.endpoint] !== 'undefined') {
                    this._knownPaths.push(route.path);
                    this._expressRouter.get(route.path, async (req, res) => {
                        const options = {
                            logErrors: route.logErrors
                        };
                        const result = await this.attendRequest(this._endpoints[route.endpoint], route.map, req.url, req.params, options);
                        res.status(result.status).json(result.body);
                    });
                }
                else {
                    throw new types_1.WAException(`WebToApiRouter::buildExpressRouter() Error: Unknown endpoint '${route.endpoint}'`);
                }
            }
            this._expressRouter.all('*', (req, res) => {
                res.status(libraries_1.httpStatusCodes.BAD_REQUEST).json({
                    message: `Unable to handle url '${req.url}'`,
                    knownPaths: this._knownPaths
                });
            });
        }
    }
    buildKoaRouter() {
        this._koaRouter = libraries_1.KoaRouter();
        for (const route of this._config.routes) {
            if (typeof this._endpoints[route.endpoint] !== 'undefined') {
                this._knownPaths.push(route.path);
                this._koaRouter.get(route.path, async (ctx) => {
                    const options = {
                        logErrors: route.logErrors
                    };
                    const result = await this.attendRequest(this._endpoints[route.endpoint], route.map, ctx.url, ctx.params, options);
                    if (result.status === libraries_1.httpStatusCodes.OK) {
                        ctx.body = result.body;
                    }
                    else {
                        ctx.throw(result.status, result.body);
                    }
                });
            }
            else {
                throw new types_1.WAException(`WebToApiRouter::buildKoaRouter() Error: Unknown endpoint '${route.endpoint}'`);
            }
        }
        this._koaRouter.all('*', async (ctx) => {
            ctx.throw(libraries_1.httpStatusCodes.BAD_REQUEST, {
                message: `Unable to handle url '${ctx.originalUrl}'`,
                knownPaths: this._knownPaths
            });
        });
    }
    load() {
        if (!this._loaded) {
            this._loaded = true;
            this._expressRouter = null;
            this._koaRouter = null;
        }
    }
}
exports.WebToApiRouter = WebToApiRouter;
