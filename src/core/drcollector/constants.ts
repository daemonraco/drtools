/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */

export class DRCollectorConstants {
    public static readonly AsyncLoadingTimeout: number = 10 * 1000;

    private constructor() { }
}

export class DRCollectorManagers {
    public static readonly Configs: string = 'configs';
    public static readonly Endpoints: string = 'endpoints';
    public static readonly Loader: string = 'loaders';
    public static readonly Middlewares: string = 'middlewares';
    public static readonly MockRoutes: string = 'mock-routes';
    public static readonly MySQL: string = 'mysql';
    public static readonly Plugins: string = 'plugins';
    public static readonly Routes: string = 'routes';
    public static readonly Tasks: string = 'tasks';
    public static readonly WebToApi: string = 'webtoapi';

    private constructor() { }
}

export class DRCollectorEvents {
    public static readonly ConfigsManagerRegistered: string = 'configs_manager_registered';
    public static readonly EndpointsManagerRegistered: string = 'endpoints_manager_registered';
    public static readonly LoadersManagerRegistered: string = 'loaders_manager_registered';
    public static readonly ManagerRegistered: string = 'manager_registered';
    public static readonly MiddlewaresManagerRegistered: string = 'middlewares_manager_registered';
    public static readonly MockRoutesManagerRegistered: string = 'mock_routes_manager_registered';
    public static readonly MySQLRestManagerRegistered: string = 'mysql_rest_manager_registered';
    public static readonly PluginsManagerRegistered: string = 'plugins_manager_registered';
    public static readonly RoutesManagerRegistered: string = 'routes_manager_registered';
    public static readonly TasksManagerRegistered: string = 'tasks_manager_registered';
    public static readonly WebToApiRegistered: string = 'webtoapi_registered';

    private constructor() { }
}