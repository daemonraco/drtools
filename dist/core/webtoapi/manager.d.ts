/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { BasicList } from '../includes/basic-types';
import { IManagerByKey } from '../drcollector';
import { WAEndpoint, WAEndpointList, WAParsersList, WARulesList, WAUrlParameters } from './types';
import { WebToApiRouter } from './router';
import { WAPreProcessorData } from './pre-processor-data';
export declare class WebToApi implements IManagerByKey {
    protected _cachePath: string;
    protected _config: any;
    protected _configPath: string;
    protected _customParsers: BasicList<any>;
    protected _endpoints: WAEndpointList;
    protected _loaded: boolean;
    protected _parsers: WAParsersList;
    protected _relativePath: string;
    protected _router: WebToApiRouter;
    protected _rules: WARulesList;
    constructor(configPath: string);
    cacheLifetime(): string;
    cachePath(): string;
    configPath(): string;
    customParsers(): BasicList<any>;
    description(): string;
    endpoints(): WAEndpointList;
    has(type: string): boolean;
    get(type: string, params: WAUrlParameters): Promise<any>;
    matchesKey(key: string): boolean;
    name(): string;
    parsers(): string[];
    relativePath(): string;
    routes(): any[];
    router(): any;
    protected adaptUrl(url: string, params: WAUrlParameters): string;
    protected analyze(key: string, data: string, endpoint: WAEndpoint, preRequest: WAPreProcessorData): Promise<any>;
    protected analyzeFields(fields: any[], mainDoc: any, mainElement: any): Promise<any>;
    protected applyRules(rules: any[], root: any): Promise<string>;
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
