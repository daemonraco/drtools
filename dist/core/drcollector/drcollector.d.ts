/// <reference types="node" />
/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, BasicList } from '../includes';
import { ConfigsManager } from '../configs';
import { EndpointsManager } from '../mock-endpoints';
import { EventEmitter } from 'events';
import { IAsyncManager, IManagerByKey } from './types';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { PluginsManager } from '../plugins';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';
declare class DRCollectorClass {
    protected static _Instance: DRCollectorClass | null;
    protected _configsManagers: BasicList<ConfigsManager>;
    protected _endpointsManager: BasicList<EndpointsManager>;
    protected _infoReport: any;
    protected _loadersManagers: BasicList<LoadersManager>;
    protected _middlewaresManager: BasicList<MiddlewaresManager>;
    protected _mockRoutesManager: BasicList<MockRoutesManager>;
    protected _pluginsManager: BasicList<PluginsManager>;
    protected _routesManager: BasicList<RoutesManager>;
    protected _tasksManager: BasicList<TasksManager>;
    protected _events: EventEmitter;
    protected constructor();
    configsManager(key: string): ConfigsManager;
    configsManagers(): BasicList<ConfigsManager>;
    endpointsManager(key: string): EndpointsManager;
    endpointsManagers(): BasicList<EndpointsManager>;
    infoReport(): any;
    loadersManager(key: string): LoadersManager;
    loadersManagers(): BasicList<LoadersManager>;
    middlewaresManager(key: string): MiddlewaresManager;
    middlewaresManagers(): BasicList<MiddlewaresManager>;
    mockRoutesManager(key: string): MockRoutesManager;
    mockRoutesManagers(): BasicList<MockRoutesManager>;
    on(event: string, listener: any): void;
    pluginsManager(key: string): PluginsManager;
    pluginsManagers(): BasicList<PluginsManager>;
    registerConfigsManager(manager: ConfigsManager): void;
    registerEndpointsManager(manager: EndpointsManager): void;
    registerLoadersManager(manager: LoadersManager): void;
    registerMiddlewaresManager(manager: MiddlewaresManager): void;
    registerMockRoutesManager(manager: MockRoutesManager): void;
    registerPluginsManager(manager: PluginsManager): void;
    registerRoutesManager(manager: RoutesManager): void;
    registerTasksManager(manager: TasksManager): void;
    routesManager(key: string): RoutesManager;
    routesManagers(): BasicList<RoutesManager>;
    tasksManager(key: string): TasksManager;
    tasksManagers(): BasicList<TasksManager>;
    protected findManager(managers: BasicList<IManagerByKey>, key: string): IManagerByKey | null;
    protected infoReportConfigsManager(): BasicList | null;
    protected infoReportEndpointsManager(): BasicList | null;
    protected infoReportLoadersManager(): BasicList | null;
    protected infoReportMiddlewaresManager(): BasicList | null;
    protected infoReportMockRoutesManager(): BasicList | null;
    protected infoReportPluginsManager(): BasicList | null;
    protected infoReportRoutesManager(): BasicList | null;
    protected infoReportSystem(): BasicDictionary;
    protected infoReportTasksManager(): BasicList | null;
    protected monitorAsyncManagerLoading(type: string, manager: IAsyncManager): void;
    static Instance(): DRCollectorClass;
}
export declare const DRCollector: DRCollectorClass;
export {};
