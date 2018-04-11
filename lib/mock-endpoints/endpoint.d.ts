import { EndpointData } from '.';
import { ExpressMiddleware } from '../express';
import { OptionsList } from '../includes';
export declare class Endpoint {
    protected _dirPath: string;
    protected _loaded: boolean;
    protected _loadedEndpoints: {
        [name: string]: EndpointData;
    };
    protected _restPath: string;
    protected _restPattern: RegExp;
    protected _options: OptionsList;
    constructor(dirPath: string, restPath: string, options?: OptionsList);
    expressMiddleware(): ExpressMiddleware;
    protected fixOptions(): void;
    protected genResponseFor(endpoint: string): {
        [name: string]: any;
    };
    protected load(): void;
}
