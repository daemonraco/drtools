"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRCollectorEvents = exports.DRCollectorManagers = exports.DRCollectorConstants = void 0;
class DRCollectorConstants {
    constructor() { }
}
exports.DRCollectorConstants = DRCollectorConstants;
DRCollectorConstants.AsyncLoadingTimeout = 10 * 1000;
class DRCollectorManagers {
    constructor() { }
}
exports.DRCollectorManagers = DRCollectorManagers;
DRCollectorManagers.Configs = 'configs';
DRCollectorManagers.Endpoints = 'endpoints';
DRCollectorManagers.Loader = 'loaders';
DRCollectorManagers.Middlewares = 'middlewares';
DRCollectorManagers.MockRoutes = 'mock-routes';
DRCollectorManagers.MySQL = 'mysql';
DRCollectorManagers.Plugins = 'plugins';
DRCollectorManagers.Routes = 'routes';
DRCollectorManagers.Tasks = 'tasks';
DRCollectorManagers.WebToApi = 'webtoapi';
class DRCollectorEvents {
    constructor() { }
}
exports.DRCollectorEvents = DRCollectorEvents;
DRCollectorEvents.ConfigsManagerRegistered = 'configs_manager_registered';
DRCollectorEvents.EndpointsManagerRegistered = 'endpoints_manager_registered';
DRCollectorEvents.LoadersManagerRegistered = 'loaders_manager_registered';
DRCollectorEvents.ManagerRegistered = 'manager_registered';
DRCollectorEvents.MiddlewaresManagerRegistered = 'middlewares_manager_registered';
DRCollectorEvents.MockRoutesManagerRegistered = 'mock_routes_manager_registered';
DRCollectorEvents.MySQLRestManagerRegistered = 'mysql_rest_manager_registered';
DRCollectorEvents.PluginsManagerRegistered = 'plugins_manager_registered';
DRCollectorEvents.RoutesManagerRegistered = 'routes_manager_registered';
DRCollectorEvents.TasksManagerRegistered = 'tasks_manager_registered';
DRCollectorEvents.WebToApiRegistered = 'webtoapi_registered';
