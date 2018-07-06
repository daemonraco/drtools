/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { WAEndpoint, WAEndpointList, WAParsersList, WAUrlParameters } from './types';
import { WebToApiRouter } from './router';
export declare class WebToApi {
    protected _cachePath: string;
    protected _config: any;
    protected _configPath: string;
    protected _endpoints: WAEndpointList;
    protected _loaded: boolean;
    protected _parsers: WAParsersList;
    protected _relativePath: string;
    protected _router: WebToApiRouter;
    constructor(configPath: string);
    cacheLifetime(): string;
    cachePath(): string;
    configPath(): string;
    description(): string;
    endpoints(): WAEndpointList;
    has(type: string): boolean;
    get(type: string, params: WAUrlParameters): Promise<any>;
    name(): string;
    parsers(): string[];
    relativePath(): string;
    routes(): any[];
    router(): any;
    protected adaptUrl(url: string, params: WAUrlParameters): string;
    protected analyze(key: string, data: string, endpoint: WAEndpoint): any;
    protected analyzeFields(fields: any[], mainDoc: any, mainElement: any): any;
    protected genKey(type: string, params: WAUrlParameters): string;
    protected getCachePath(key: string): string;
    protected getCache(key: string, extension: string, lifetime: number): any;
    protected getJSONCache(key: string, lifetime: number): any;
    protected getRawCache(key: string, lifetime: number): any;
    protected load(): void;
    protected loadConfig(): void;
    protected loadRouter(): void;
    protected saveCache(key: string, data: string, extension: string): void;
    protected saveJSONCache(key: string, json: any): void;
    protected saveRawCache(key: string, raw: string): void;
}
