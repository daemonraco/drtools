import { WAEndpoint, WAEndpointList, WAParsersList, WAUrlParameters } from './types';
import { WebToApiRouter } from './router';
export declare class WebToApi {
    protected _cachePath: string;
    protected _config: any;
    protected _endpoints: WAEndpointList;
    protected _loaded: boolean;
    protected _parsers: WAParsersList;
    protected _router: WebToApiRouter;
    constructor(config: any);
    has(type: string): boolean;
    get(type: string, params: WAUrlParameters): Promise<any>;
    router(): any;
    protected adaptUrl(url: string, params: WAUrlParameters): string;
    protected analyze(key: string, data: string, endpoint: WAEndpoint): any;
    protected analyzeFields(fields: any[], mainDoc: any, mainElement: any): any;
    protected genKey(type: string, params: WAUrlParameters): string;
    protected getCachePath(key: string): string;
    protected getCache(key: string): any;
    protected load(): void;
    protected loadRouter(): void;
    protected saveCache(key: string, raw: string, json: any): void;
}
