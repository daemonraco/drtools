/**
 * @file router.ts
 * @author Alejandro D. Simi
 */

import { KoaRouter, express, httpStatusCodes } from '../../libraries';

import { OptionsList, StringsDictionary } from '../includes/basic-types';
import { WAEndpoint, WAEndpointList, WAException } from './types';
import { WebToApi } from './manager';

declare var Promise: any;

export class WebToApiRouter {
    //
    // Protected properties.
    protected _config: any = null;
    protected _endpoints: WAEndpointList;
    protected _expressRouter: any = null;
    protected _knownPaths: string[] = [];
    protected _koaRouter: any = null;
    protected _loaded: boolean = false;
    protected _manager: WebToApi = null;
    //
    // Constructor.
    public constructor(manager: WebToApi, endpoints: WAEndpointList, config: any) {
        this._manager = manager;
        this._endpoints = endpoints;
        this._config = config;

        this.load();
    }
    //
    // Public methods.
    public expressRouter(): any {
        this.buildExpressRouter();
        return this._expressRouter;
    }
    public koaRouter(): any {
        this.buildKoaRouter();
        return this._koaRouter;
    }
    //
    // Protected methods.
    protected async attendRequest(endpoint: WAEndpoint, map: StringsDictionary, url: string, urlParams: any, options: OptionsList = {}): Promise<any> {
        const results: any = {
            body: null,
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
        }

        const params: StringsDictionary = {};
        for (const k of Object.keys(map)) {
            if (typeof urlParams[map[k]] !== 'undefined') {
                params[k] = urlParams[map[k]];
            }
        }

        try {
            const res: any = await this._manager.get(endpoint.name, params);
            results.status = httpStatusCodes.OK;
            results.body = res;
        } catch (error) {
            if (options.logErrors) {
                console.error(`Error at '${url}'`, error);
            }

            results.status = httpStatusCodes.INTERNAL_SERVER_ERROR;
            results.body = { error: `${error}` };
        }

        return results;
    }
    protected buildExpressRouter(): void {
        if (!this._expressRouter) {
            this._expressRouter = express.Router();

            for (const route of this._config.routes) {
                if (typeof this._endpoints[route.endpoint] !== 'undefined') {
                    this._knownPaths.push(route.path);

                    this._expressRouter.get(route.path, async (req: any, res: any): Promise<any> => {
                        const options: OptionsList = {
                            logErrors: route.logErrors
                        };

                        const result: any = await this.attendRequest(this._endpoints[route.endpoint], route.map, req.url, req.params, options);
                        res.status(result.status).json(result.body);
                    });
                } else {
                    throw new WAException(`WebToApiRouter::buildExpressRouter() Error: Unknown endpoint '${route.endpoint}'`);
                }
            }

            this._expressRouter.all('*', (req: any, res: any) => {
                res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: `Unable to handle url '${req.url}'`,
                    knownPaths: this._knownPaths
                });
            });
        }
    }
    protected buildKoaRouter(): void {
        this._koaRouter = KoaRouter();

        for (const route of this._config.routes) {
            if (typeof this._endpoints[route.endpoint] !== 'undefined') {
                this._knownPaths.push(route.path);

                this._koaRouter.get(route.path, async (ctx: any): Promise<any> => {
                    const options: OptionsList = {
                        logErrors: route.logErrors
                    };

                    const result: any = await this.attendRequest(this._endpoints[route.endpoint], route.map, ctx.url, ctx.params, options);
                    if (result.status === httpStatusCodes.OK) {
                        ctx.body = result.body;
                    } else {
                        ctx.throw(result.status, result.body);
                    }
                });
            } else {
                throw new WAException(`WebToApiRouter::buildKoaRouter() Error: Unknown endpoint '${route.endpoint}'`);
            }
        }

        this._koaRouter.all('*', async (ctx: any): Promise<any> => {
            ctx.throw(httpStatusCodes.BAD_REQUEST, {
                message: `Unable to handle url '${ctx.originalUrl}'`,
                knownPaths: this._knownPaths
            });
        });
    }
    protected load(): void {
        if (!this._loaded) {
            this._loaded = true;

            this._expressRouter = null;
            this._koaRouter = null;
        }
    }
}
