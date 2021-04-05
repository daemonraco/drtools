import { ConfigsManager } from '../configs';
import { IManagerByKey } from '../drcollector';
import { IMockRoutesGuard, IMockRoutesOptions, IMockRoutesRoute } from '.';
export declare class MockRoutesManager implements IManagerByKey {
    protected _configs: ConfigsManager | null;
    protected _configsValidator: any;
    protected _guards: {
        [name: string]: IMockRoutesGuard;
    };
    protected _lastError: string | null;
    protected _options: IMockRoutesOptions | null;
    protected _routes: {
        [uri: string]: IMockRoutesRoute;
    };
    protected _routesConfig: any;
    protected _routesConfigPath: string | null;
    protected _valid: boolean;
    constructor(app: any, routesConfigPath: string, options?: IMockRoutesOptions | null, configs?: ConfigsManager | null);
    config(): any;
    configPath(): string | null;
    guards(): IMockRoutesGuard[];
    lastError(): string | null;
    matchesKey(key: string): boolean;
    routes(): IMockRoutesRoute[];
    valid(): boolean;
    protected attach(app: any): void;
    protected cleanParams(): void;
    protected fullPath(relativePath: string): string;
    protected load(isExpress: boolean): void;
    protected loadGuard(guardSpec: any): IMockRoutesGuard;
    protected loadGuards(isExpress: boolean): void;
    protected loadRoutes(): void;
    protected static RouteKey(route: any): string;
}
