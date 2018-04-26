import { ConfigsManager } from '../configs';
import { MockRoutesOptions, MockRoutesRoute } from '.';
export declare class MockRoutesManager {
    protected _configs: ConfigsManager;
    protected _configsValidator: any;
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
    lastError(): string;
    routes(): MockRoutesRoute[];
    valid(): boolean;
    protected cleanParams(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
    protected static FullPathFromConfig(configPath: string, relativePath: string): string;
    protected static RouteKey(route: any): string;
}
