/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IManagerByKey } from '../drcollector';
import { Endpoint, IEndpointBrief, IEndpointsManagerOptions, IEndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
import { KoaMiddleware } from '../koa';
export declare class EndpointsManager implements IManagerByKey {
    protected _configs: ConfigsManager | null;
    protected _endpointsDirectory: string;
    protected _endpointsUri: string;
    protected _lastError: string | null;
    protected _options: IEndpointsManagerOptions;
    protected _provider: Endpoint | null;
    protected _valid: boolean;
    constructor(options: IEndpointsManagerOptions, configs?: ConfigsManager | null);
    directory(): string;
    lastError(): string | null;
    matchesKey(key: string): boolean;
    options(): IEndpointOptions | null;
    paths(): IEndpointBrief[];
    provide(): ExpressMiddleware;
    provideForKoa(): KoaMiddleware;
    valid(): boolean;
    uri(): string;
    protected cleanOptions(): void;
    protected load(): void;
    protected provideInvalidKoaMiddleware(): KoaMiddleware;
    protected provideInvalidMiddleware(): ExpressMiddleware;
}
