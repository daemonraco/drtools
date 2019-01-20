/**
 * @file router.ts
 * @author Alejandro D. Simi
 */
import { OptionsList, StringsDictionary } from '../includes/basic-types';
import { WAEndpoint, WAEndpointList } from './types';
import { WebToApi } from './manager';
export declare class WebToApiRouter {
    protected _config: any;
    protected _endpoints: WAEndpointList;
    protected _expressRouter: any;
    protected _knownPaths: string[];
    protected _koaRouter: any;
    protected _loaded: boolean;
    protected _manager: WebToApi;
    constructor(manager: WebToApi, endpoints: WAEndpointList, config: any);
    expressRouter(): any;
    koaRouter(): any;
    protected attendRequest(endpoint: WAEndpoint, map: StringsDictionary, url: string, urlParams: any, options?: OptionsList): Promise<any>;
    protected buildExpressRouter(): void;
    protected buildKoaRouter(): void;
    protected load(): void;
}
