/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
export declare class DRCollectorConstants {
    static readonly AsyncLoadingTimeout: number;
    private constructor();
}
export declare class DRCollectorManagers {
    static readonly Configs: string;
    static readonly Endpoints: string;
    static readonly Loader: string;
    static readonly Middlewares: string;
    static readonly MockRoutes: string;
    static readonly MySQL: string;
    static readonly Plugins: string;
    static readonly Routes: string;
    static readonly Tasks: string;
    static readonly WebToApi: string;
    private constructor();
}
export declare class DRCollectorEvents {
    static readonly ConfigsManagerRegistered: string;
    static readonly EndpointsManagerRegistered: string;
    static readonly LoadersManagerRegistered: string;
    static readonly ManagerRegistered: string;
    static readonly MiddlewaresManagerRegistered: string;
    static readonly MockRoutesManagerRegistered: string;
    static readonly MySQLRestManagerRegistered: string;
    static readonly PluginsManagerRegistered: string;
    static readonly RoutesManagerRegistered: string;
    static readonly TasksManagerRegistered: string;
    static readonly WebToApiRegistered: string;
    private constructor();
}
