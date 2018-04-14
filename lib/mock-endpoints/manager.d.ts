import { ConfigsManager } from '../configs';
import { Endpoint, EndpointsManagerOptions, EndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
export declare class EndpointsManager {
    protected _configs: ConfigsManager;
    protected _provider: Endpoint;
    protected _endpointsDirectory: string;
    protected _endpointsUri: string;
    protected _lastError: string;
    protected _options: EndpointsManagerOptions;
    protected _valid: boolean;
    constructor(options: EndpointsManagerOptions, configs?: ConfigsManager);
    directory(): string;
    lastError(): string;
    options(): EndpointOptions;
    provide(): ExpressMiddleware;
    valid(): boolean;
    uri(): string;
    protected cleanOptions(): void;
    protected load(): void;
    protected provideInvalidMiddleware(): ExpressMiddleware;
}
