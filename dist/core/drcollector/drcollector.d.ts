/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */
/// <reference types="node" />
import { EventEmitter } from '../../libraries';
import { BasicList } from '../includes';
import { ConfigsManager } from '../configs';
import { EndpointsManager } from '../mock-endpoints';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { MySQLRestManager } from '../mysql';
import { PluginsManager } from '../plugins';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';
import { WebToApi } from '../webtoapi';
declare class DRCollectorClass {
    protected static _Instance: DRCollectorClass;
    protected _configsManagers: BasicList<ConfigsManager>;
    protected _endpointsManager: BasicList<EndpointsManager>;
    protected _infoReport: any;
    protected _loadersManagers: BasicList<LoadersManager>;
    protected _middlewaresManager: BasicList<MiddlewaresManager>;
    protected _mockRoutesManager: BasicList<MockRoutesManager>;
    protected _mySQLRestManager: BasicList<MySQLRestManager>;
    protected _pluginsManager: BasicList<PluginsManager>;
    protected _routesManager: BasicList<RoutesManager>;
    protected _tasksManager: BasicList<TasksManager>;
    protected _webToApi: BasicList<WebToApi>;
    protected _events: EventEmitter;
    protected constructor();
    configsManagers(): BasicList<ConfigsManager>;
    endpointsManagers(): BasicList<EndpointsManager>;
    infoReport(): any;
    loadersManagers(): BasicList<LoadersManager>;
    middlewaresManagers(): BasicList<MiddlewaresManager>;
    mockRoutesManagers(): BasicList<MockRoutesManager>;
    mySQLRestManagers(): BasicList<MySQLRestManager>;
    on(event: string, listener: any): void;
    pluginsManagers(): BasicList<PluginsManager>;
    registerConfigsManager(manager: ConfigsManager): void;
    registerEndpointsManager(manager: EndpointsManager): void;
    registerLoadersManager(manager: LoadersManager): void;
    registerMiddlewaresManager(manager: MiddlewaresManager): void;
    registerMockRoutesManager(manager: MockRoutesManager): void;
    registerMySQLRestManager(manager: MySQLRestManager): void;
    registerPluginsManager(manager: PluginsManager): void;
    registerRoutesManager(manager: RoutesManager): void;
    registerTasksManager(manager: TasksManager): void;
    registerWebToApi(manager: WebToApi): void;
    routesManagers(): BasicList<RoutesManager>;
    tasksManagers(): BasicList<TasksManager>;
    webToApi(): BasicList<WebToApi>;
    protected infoReportConfigsManager(): BasicList<any>;
    protected infoReportEndpointsManager(): BasicList<any>;
    protected infoReportLoadersManager(): BasicList<any>;
    protected infoReportMiddlewaresManager(): BasicList<any>;
    protected infoReportMockRoutesManager(): BasicList<any>;
    protected infoReportMySQLRestManager(): BasicList<any>;
    protected infoReportPluginsManager(): BasicList<any>;
    protected infoReportRoutesManager(): BasicList<any>;
    protected infoReportTasksManager(): BasicList<any>;
    protected infoReportWebToApi(): BasicList<any>;
    static Instance(): DRCollectorClass;
}
export declare const DRCollector: DRCollectorClass;
export {};
