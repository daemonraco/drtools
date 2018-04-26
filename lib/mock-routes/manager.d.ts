import { ConfigsManager } from '../configs';
import { MockRoutesGuard, MockRoutesOptions, MockRoutesRoute } from '.';
export declare class MockRoutesManager {
    protected _configs: ConfigsManager;
    protected _configsValidator: any;
    protected _guards: {
        [name: string]: MockRoutesGuard;
    };
    protected _lastError: string;
    protected _options: MockRoutesOptions;
    protected _routes: {
        [uri: string]: MockRoutesRoute;
    };
    protected _routesConfig: any;
    protected _routesConfigPath: string;
    protected _valid: boolean;
    constructor(app: any, routesConfigPath: string, options?: MockRoutesOptions, configs?: ConfigsManager);
    config(): any;
    configPath(): string;
    guards(): MockRoutesGuard[];
    lastError(): string;
    routes(): MockRoutesRoute[];
    valid(): boolean;
    protected attach(app: any): void;
    protected cleanParams(): void;
    protected fullPath(relativePath: string): string;
    protected load(): void;
    protected loadGuard(guardSpec: any): MockRoutesGuard;
    protected loadGuards(): void;
    protected loadRoutes(): void;
    protected static RouteKey(route: any): string;
}
