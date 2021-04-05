/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { IConfigItem, IConfigOptions } from '.';
import { IManagerByKey } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { BasicDictionary } from '../includes';
import { KoaMiddleware } from '../koa';
import { IConfigSpecItem } from './types';
declare enum PublishExportsTypes {
    Express = "express",
    Koa = "koa"
}
export declare class ConfigsManager implements IManagerByKey {
    protected _directories: string[];
    protected _environmentName: string;
    protected _exports: BasicDictionary;
    protected _items: BasicDictionary<IConfigItem>;
    protected _key: string;
    protected _lastError: string;
    protected _options: IConfigOptions;
    protected _publicUri: string;
    protected _specs: BasicDictionary<IConfigSpecItem>;
    protected _specsDirectories: string[];
    protected _valid: boolean;
    constructor(directory: string | string[], options?: IConfigOptions);
    directories(): string[];
    environmentName(): string;
    get(name: string): any;
    getSpecs(name: string): any;
    items(): BasicDictionary<IConfigItem>;
    itemNames(): string[];
    key(): string;
    lastError(): string;
    matchesKey(key: string): boolean;
    options(): IConfigOptions;
    publicItemNames(): string[];
    publishExports(uri?: string): ExpressMiddleware;
    publishExportsForKoa(uri?: string): KoaMiddleware;
    publicUri(): string;
    specs(): BasicDictionary<IConfigSpecItem>;
    specsDirectories(): string[];
    specsSuffix(): string;
    suffix(): string;
    valid(): boolean;
    protected cleanOptions(): void;
    protected expandEnvVariablesIn(data: any): any;
    protected genericPublishExports(type: PublishExportsTypes, uri?: string): ExpressMiddleware | KoaMiddleware;
    protected load(): void;
    protected loadExportsOf(name: string): boolean;
    protected loadSpecsOf(name: string): string;
    protected validateSpecsOf(name: string): boolean;
}
export {};
