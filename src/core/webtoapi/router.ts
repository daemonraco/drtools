/**
 * @file router.ts
 * @author Alejandro D. Simi
 */

import { express, httpStatusCodes } from '../../libraries';

import { OptionsList, StringsDictionary } from '../includes/basic-types';
import { WAEndpoint, WAEndpointList, WAException } from './types';
import { WebToApi } from './manager';

export class WebToApiRouter {
    //
    // Protected properties.
    protected _config: any = null;
    protected _endpoints: WAEndpointList;
    protected _knownPaths: string[] = [];
    protected _loaded: boolean = false;
    protected _manager: WebToApi = null;
    protected _router: any = null;
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
        return this._router;
    }
    //
    // Protected methods.
    protected attendDefaultRequest(req: any, res: any): void {
        res.status(httpStatusCodes.BAD_REQUEST).json({
            message: `Unable to handle url '${req.url}'`,
            knownPaths: this._knownPaths
        });
    }
    protected attendRequest(endpoint: WAEndpoint, map: StringsDictionary, req: any, res: any, options: OptionsList = {}): void {
        const params: StringsDictionary = {};
        for (const k of Object.keys(map)) {
            if (typeof req.params[map[k]] !== 'undefined') {
                params[k] = req.params[map[k]];
            }
        }

        this._manager.get(endpoint.name, params)
            .then(results => res.status(httpStatusCodes.OK).json(results))
            .catch(error => {
                if (options.logErrors) {
                    console.error(`Error at '${req.url}'`, error);
                }

                res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
            });
    }
    protected load(): void {
        if (!this._loaded) {
            this._loaded = true;

            this._router = express.Router();

            for (const route of this._config.routes) {
                if (typeof this._endpoints[route.endpoint] !== 'undefined') {
                    this._knownPaths.push(route.path);

                    this._router.get(route.path, (req: any, res: any) => {
                        const options: OptionsList = {
                            logErrors: route.logErrors
                        };
                        this.attendRequest(this._endpoints[route.endpoint], route.map, req, res, options);
                    });
                } else {
                    throw new WAException(`WebToApiRouter::load() Error: Unknown endpoint '${route.endpoint}'`);
                }
            }

            this._router.all('*', (req: any, res: any) => {
                this.attendDefaultRequest(req, res);
            });
        }
    }
}
