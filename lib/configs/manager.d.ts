import { ExpressMiddleware } from '../express';
export declare type ConfigsList = {
    [name: string]: any;
};
export interface ConfigOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare class ConfigsManager {
    protected _configs: ConfigsList;
    protected _configsDirectory: string;
    protected _environmentName: string;
    protected _exports: ConfigsList;
    protected _lastError: string;
    protected _options: ConfigOptions;
    protected _valid: boolean;
    constructor(configsDirectory: string, options?: ConfigOptions);
    configsDirectory(): string;
    environmentName(): string;
    get(name: string): any;
    lastError(): string;
    publishExports(uri?: string): ExpressMiddleware;
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(configsDirectory: string): void;
    protected loadExports(name: string): void;
}
