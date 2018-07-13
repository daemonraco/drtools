"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DRCollectorEvents {
    constructor() { }
}
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
exports.DRCollectorEvents = DRCollectorEvents;
