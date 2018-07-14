/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IManagerByKey } from '../drcollector';
import { Endpoint, IEndpointBrief, IEndpointsManagerOptions, IEndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
export declare class EndpointsManager implements IManagerByKey {
    protected _configs: ConfigsManager;
    protected _endpointsDirectory: string;
    protected _endpointsUri: string;
    protected _lastError: string;
    protected _options: IEndpointsManagerOptions;
    protected _provider: Endpoint;
    protected _valid: boolean;
    constructor(options: IEndpointsManagerOptions, configs?: ConfigsManager);
    directory(): string;
    lastError(): string;
    matchesKey(key: string): boolean;
    options(): IEndpointOptions;
    paths(): IEndpointBrief[];
    provide(): ExpressMiddleware;
    valid(): boolean;
    uri(): string;
    protected cleanOptions(): void;
    protected load(): void;
    protected provideInvalidMiddleware(): ExpressMiddleware;
}
