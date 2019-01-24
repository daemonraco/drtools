/**
 * @file endpoint.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
import { IEndpointBrief, EndpointData, IEndpointOptions } from '.';
import { KoaMiddleware } from '../koa';
export declare class Endpoint {
    protected _dirPath: string;
    protected _loaded: boolean;
    protected _loadedEndpoints: {
        [path: string]: EndpointData;
    };
    protected _restPath: string;
    protected _restPattern: RegExp;
    protected _options: IEndpointOptions;
    constructor(dirPath: string, restPath: string, options?: IEndpointOptions);
    paths(): IEndpointBrief[];
    directory(): string;
    expressMiddleware(): ExpressMiddleware;
    koaMiddleware(): KoaMiddleware;
    responseFor(endpoint: string, method: string, simple?: boolean): {
        [name: string]: any;
    };
    uri(): string;
    protected fixConstructorParams(): void;
    protected load(): void;
    protected loadAllEndpoints(): void;
    protected loadEndpoint(endpoint: string): void;
}
