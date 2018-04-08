import { ExpressMiddleware } from '../includes/basic-types';
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
    protected _options: ConfigOptions;
    constructor(configsDirectory: string, options?: ConfigOptions);
    configsDirectory(): string;
    environmentName(): string;
    get(name: string): any;
    publishExports(uri?: string): ExpressMiddleware;
    protected cleanOptions(): void;
    protected load(configsDirectory: string): void;
    protected loadExports(name: string): void;
}
