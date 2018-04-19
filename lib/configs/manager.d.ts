import { ConfigsList, ConfigOptions, ConfigSpecsList } from '.';
import { ExpressMiddleware } from '../express';
export declare class ConfigsManager {
    protected _configs: ConfigsList;
    protected _directory: string;
    protected _environmentName: string;
    protected _exports: ConfigsList;
    protected _lastError: string;
    protected _options: ConfigOptions;
    protected _specs: ConfigSpecsList;
    protected _specsDirectory: string;
    protected _valid: boolean;
    constructor(directory: string, options?: ConfigOptions);
    directory(): string;
    environmentName(): string;
    get(name: string): any;
    getSpecs(name: string): any;
    itemNames(): string[];
    lastError(): string;
    publicItemNames(): string[];
    publishExports(uri?: string): ExpressMiddleware;
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(): void;
    protected loadExportsOf(name: string): void;
    protected loadSpecsOf(name: string): boolean;
    protected validateSpecsOf(name: string): boolean;
}
