import { ConfigsManager } from '../configs';
import { Endpoint, EndpointsManagerOptions } from '.';
import { ExpressMiddleware } from '../express';
export declare class EndpointsManager {
    protected _configs: ConfigsManager;
    protected _provider: Endpoint;
    protected _endpointsDirectory: string;
    protected _endpointsUri: string;
    protected _options: EndpointsManagerOptions;
    constructor(options: EndpointsManagerOptions, configs?: ConfigsManager);
    provide(): ExpressMiddleware;
    protected cleanOptions(): void;
    protected load(): void;
}
