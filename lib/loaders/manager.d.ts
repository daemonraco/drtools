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
    protected _lastError: string;
    protected _loadersDirectory: string;
    protected _options: LoaderOptions;
    protected _valid: boolean;
    constructor(loadersDirectory: string, options: LoaderOptions, configs: ConfigsManager);
    lastError(): string;
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(loadersDirectory: string): void;
}
