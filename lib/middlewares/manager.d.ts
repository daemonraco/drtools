import { ConfigsManager } from '../configs';
export declare type MiddlewaresList = {
    [name: string]: any;
};
export interface MiddlewareOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare class MiddlewaresManager {
    protected _configs: ConfigsManager;
    protected _directory: string;
    protected _lastError: string;
    protected _options: MiddlewareOptions;
    protected _valid: boolean;
    constructor(app: any, directory: string, options: MiddlewareOptions, configs: ConfigsManager);
    directory(): string;
    lastError(): string;
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(app: any, directory: string): void;
}
