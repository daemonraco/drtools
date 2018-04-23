import { ConfigsManager } from '../configs';
import { Endpoint, EndpointBrief, EndpointsManagerOptions, EndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
export declare class EndpointsManager {
    protected _configs: ConfigsManager;
    protected _endpointsDirectory: string;
    protected _endpointsUri: string;
    protected _lastError: string;
    protected _options: EndpointsManagerOptions;
    protected _provider: Endpoint;
    protected _valid: boolean;
    constructor(options: EndpointsManagerOptions, configs?: ConfigsManager);
    directory(): string;
    lastError(): string;
    options(): EndpointOptions;
    paths(): EndpointBrief[];
    provide(): ExpressMiddleware;
    valid(): boolean;
    uri(): string;
    protected cleanOptions(): void;
    protected load(): void;
    protected provideInvalidMiddleware(): ExpressMiddleware;
}
