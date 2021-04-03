/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
export declare enum DRCollectorConstants {
    AsyncLoadingTimeout = 10000
}
export declare enum DRCollectorManagers {
    Configs = "configs",
    Endpoints = "endpoints",
    Loader = "loaders",
    Middlewares = "middlewares",
    MockRoutes = "mock-routes",
    Plugins = "plugins",
    Routes = "routes",
    Tasks = "tasks"
}
export declare enum DRCollectorEvents {
    ConfigsManagerRegistered = "configs_manager_registered",
    EndpointsManagerRegistered = "endpoints_manager_registered",
    LoadersManagerRegistered = "loaders_manager_registered",
    ManagerRegistered = "manager_registered",
    MiddlewaresManagerRegistered = "middlewares_manager_registered",
    MockRoutesManagerRegistered = "mock_routes_manager_registered",
    PluginsManagerRegistered = "plugins_manager_registered",
    RoutesManagerRegistered = "routes_manager_registered",
    TasksManagerRegistered = "tasks_manager_registered"
}
