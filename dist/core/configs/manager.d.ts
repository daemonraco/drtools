/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigItemSpec, ConfigsList, IConfigOptions, ConfigSpecsList } from '.';
import { IManagerByKey } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { KoaMiddleware } from '../koa';
declare enum PublishExportsTypes {
    Express = "express",
    Koa = "koa"
}
export declare class ConfigsManager implements IManagerByKey {
    protected _configs: ConfigsList;
    protected _directory: string;
    protected _environmentName: string;
    protected _items: ConfigItemSpec[];
    protected _exports: ConfigsList;
    protected _lastError: string;
    protected _options: IConfigOptions;
    protected _specs: ConfigSpecsList;
    protected _specsDirectory: string;
    protected _publicUri: string;
    protected _valid: boolean;
    constructor(directory: string, options?: IConfigOptions);
    directory(): string;
    environmentName(): string;
    get(name: string): any;
    getSpecs(name: string): any;
    items(): ConfigItemSpec[];
    itemNames(): string[];
    lastError(): string;
    matchesKey(key: string): boolean;
    options(): IConfigOptions;
    publicItemNames(): string[];
    publishExports(uri?: string): ExpressMiddleware;
    publishExportsForKoa(uri?: string): KoaMiddleware;
    publicUri(): string;
    specsDirectory(): string;
    suffix(): string;
    valid(): boolean;
    protected cleanOptions(): void;
    protected genericPublishExports(type: PublishExportsTypes, uri?: string): ExpressMiddleware | KoaMiddleware;
    protected load(): void;
    protected loadExportsOf(name: string): boolean;
    protected loadSpecsOf(name: string): string;
    protected validateSpecsOf(name: string, specsPath: string): boolean;
}
export {};
