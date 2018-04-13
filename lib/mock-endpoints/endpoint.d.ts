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
    expressMiddleware(): ExpressMiddleware;
    protected fixConstructorParams(): void;
    protected genResponseFor(endpoint: string): {
        [name: string]: any;
    };
    protected load(): void;
}
