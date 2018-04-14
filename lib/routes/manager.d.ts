import { ConfigsManager } from '../configs';
export declare type RoutesList = {
    [name: string]: any;
};
export interface RouteOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare class RoutesManager {
    protected _configs: ConfigsManager;
    protected _directory: string;
    protected _lastError: string;
    protected _options: RouteOptions;
    protected _routes: any[];
    protected _valid: boolean;
    constructor(app: any, directory: string, options: RouteOptions, configs: ConfigsManager);
    directory(): string;
    lastError(): string;
    routes(): string[];
    valid(): boolean;
    protected cleanOptions(): void;
    protected load(app: any, directory: string): void;
}
