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
    protected _knownPaths: string[];
    protected _loaded: boolean;
    protected _manager: WebToApi;
    protected _router: any;
    constructor(manager: WebToApi, endpoints: WAEndpointList, config: any);
    expressRouter(): any;
    protected attendDefaultRequest(req: any, res: any): void;
    protected attendRequest(endpoint: WAEndpoint, map: StringsDictionary, req: any, res: any, options?: OptionsList): void;
    protected load(): void;
}
