import { EndpointData, EndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
export declare class Endpoint {
    protected _dirPath: string;
    protected _loaded: boolean;
    protected _loadedEndpoints: {
        [name: string]: EndpointData;
    };
    protected _restPath: string;
    protected _restPattern: RegExp;
    protected _options: EndpointOptions;
    constructor(dirPath: string, restPath: string, options?: EndpointOptions);
    directory(): string;
    expressMiddleware(): ExpressMiddleware;
    responseFor(endpoint: string, simple?: boolean): {
        [name: string]: any;
    };
    uri(): string;
    protected fixConstructorParams(): void;
    protected load(): void;
}
