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
    protected _directory: string;
    protected _lastError: string;
    protected _options: LoaderOptions;
    protected _valid: boolean;
    constructor(directory: string, options: LoaderOptions, configs: ConfigsManager);
    directory(): string;
    lastError(): string;
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(directory: string): void;
}
