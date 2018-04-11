import { ConfigsManager } from '../configs';
export declare type LoadersList = {
    [name: string]: any;
};
export interface LoaderOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare class LoadersManager {
    protected _configs: ConfigsManager;
    protected _loadersDirectory: string;
    protected _options: LoaderOptions;
    constructor(loadersDirectory: string, options: LoaderOptions, configs: ConfigsManager);
    protected cleanOptions(): void;
    protected load(loadersDirectory: string): void;
}
