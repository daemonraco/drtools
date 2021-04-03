"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRCollectorEvents = exports.DRCollectorManagers = exports.DRCollectorConstants = void 0;
var DRCollectorConstants;
(function (DRCollectorConstants) {
    DRCollectorConstants[DRCollectorConstants["AsyncLoadingTimeout"] = 10000] = "AsyncLoadingTimeout";
})(DRCollectorConstants = exports.DRCollectorConstants || (exports.DRCollectorConstants = {}));
var DRCollectorManagers;
(function (DRCollectorManagers) {
    DRCollectorManagers["Configs"] = "configs";
    DRCollectorManagers["Endpoints"] = "endpoints";
    DRCollectorManagers["Loader"] = "loaders";
    DRCollectorManagers["Middlewares"] = "middlewares";
    DRCollectorManagers["MockRoutes"] = "mock-routes";
    DRCollectorManagers["Plugins"] = "plugins";
    DRCollectorManagers["Routes"] = "routes";
    DRCollectorManagers["Tasks"] = "tasks";
})(DRCollectorManagers = exports.DRCollectorManagers || (exports.DRCollectorManagers = {}));
var DRCollectorEvents;
(function (DRCollectorEvents) {
    DRCollectorEvents["ConfigsManagerRegistered"] = "configs_manager_registered";
    DRCollectorEvents["EndpointsManagerRegistered"] = "endpoints_manager_registered";
    DRCollectorEvents["LoadersManagerRegistered"] = "loaders_manager_registered";
    DRCollectorEvents["ManagerRegistered"] = "manager_registered";
    DRCollectorEvents["MiddlewaresManagerRegistered"] = "middlewares_manager_registered";
    DRCollectorEvents["MockRoutesManagerRegistered"] = "mock_routes_manager_registered";
    DRCollectorEvents["PluginsManagerRegistered"] = "plugins_manager_registered";
    DRCollectorEvents["RoutesManagerRegistered"] = "routes_manager_registered";
    DRCollectorEvents["TasksManagerRegistered"] = "tasks_manager_registered";
})(DRCollectorEvents = exports.DRCollectorEvents || (exports.DRCollectorEvents = {}));
