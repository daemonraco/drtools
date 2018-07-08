/**
 * @file endpoint.ts
 * @author Alejandro D. Simi
 */
import { EndpointBrief, EndpointData, EndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
export declare class Endpoint {
    protected _dirPath: string;
    protected _loaded: boolean;
    protected _loadedEndpoints: {
        [path: string]: EndpointData;
    };
    protected _restPath: string;
    protected _restPattern: RegExp;
    protected _options: EndpointOptions;
    constructor(dirPath: string, restPath: string, options?: EndpointOptions);
    paths(): EndpointBrief[];
    directory(): string;
    expressMiddleware(): ExpressMiddleware;
    responseFor(endpoint: string, method: string, simple?: boolean): {
        [name: string]: any;
    };
    uri(): string;
    protected fixConstructorParams(): void;
    protected load(): void;
    protected loadAllEndpoints(): void;
    protected loadEndpoint(endpoint: string): void;
}
