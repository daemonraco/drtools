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
        this._loaded = false;
        this._manager = null;
        this._router = null;
        this._manager = manager;
        this._endpoints = endpoints;
        this._config = config;
        this.load();
    }
    //
    // Public methods.
    expressRouter() {
        return this._router;
    }
    //
    // Protected methods.
    attendDefaultRequest(req, res) {
        res.status(libraries_1.httpStatusCodes.BAD_REQUEST).json({
            message: `Unable to handle url '${req.url}'`
        });
    }
    attendRequest(endpoint, map, req, res) {
        const params = {};
        for (const k of Object.keys(map)) {
            if (typeof req.params[map[k]] !== 'undefined') {
                params[k] = req.params[map[k]];
            }
        }
        this._manager.get(endpoint.name, params)
            .then(results => res.status(libraries_1.httpStatusCodes.OK).json(results))
            .catch(error => res.status(libraries_1.httpStatusCodes.INTERNAL_SERVER_ERROR).json(error));
    }
    load() {
        if (!this._loaded) {
            this._loaded = true;
            this._router = libraries_1.express.Router();
            for (const route of this._config.routes) {
                if (typeof this._endpoints[route.endpoint] !== 'undefined') {
                    this._router.get(route.path, (req, res) => {
                        this.attendRequest(this._endpoints[route.endpoint], route.map, req, res);
                    });
                    this._router.all('*', this.attendDefaultRequest);
                }
                else {
                    throw new types_1.WAException(`WebToApiRouter::load() Error: Unknown endpoint '${route.endpoint}'`);
                }
            }
        }
    }
}
exports.WebToApiRouter = WebToApiRouter;
