import { ConfigsManager } from '../configs/manager';
export declare type RoutesList = {
    [name: string]: any;
};
export interface RouteOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare class RoutesManager {
    protected _configs: ConfigsManager;
    protected _routesDirectory: string;
    protected _options: RouteOptions;
    constructor(app: any, routesDirectory: string, options: RouteOptions, configs: ConfigsManager);
    protected cleanOptions(): void;
    protected load(app: any, routesDirectory: string): void;
}
