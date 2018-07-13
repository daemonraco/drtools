/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigItemSpec, ConfigsList, ConfigOptions, ConfigSpecsList } from '.';
import { ExpressMiddleware } from '../express';
export declare class ConfigsManager {
    protected _configs: ConfigsList;
    protected _directory: string;
    protected _environmentName: string;
    protected _items: ConfigItemSpec[];
    protected _exports: ConfigsList;
    protected _lastError: string;
    protected _options: ConfigOptions;
    protected _specs: ConfigSpecsList;
    protected _specsDirectory: string;
    protected _publicUri: string;
    protected _valid: boolean;
    constructor(directory: string, options?: ConfigOptions);
    directory(): string;
    environmentName(): string;
    get(name: string): any;
    getSpecs(name: string): any;
    items(): ConfigItemSpec[];
    itemNames(): string[];
    lastError(): string;
    options(): ConfigOptions;
    publicItemNames(): string[];
    publishExports(uri?: string): ExpressMiddleware;
    publicUri(): string;
    specsDirectory(): string;
    suffix(): string;
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(): void;
    protected loadExportsOf(name: string): boolean;
    protected loadSpecsOf(name: string): string;
    protected validateSpecsOf(name: string, specsPath: string): boolean;
}
