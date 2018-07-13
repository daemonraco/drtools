/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */

import { EventEmitter } from '../../libraries';

import { BasicList, Tools } from '../includes';
import { ConfigsManager } from '../configs';
import { DRCollectorEvents } from './constants';
import { EndpointsManager } from '../mock-endpoints';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { MySQLRestManager } from '../mysql';
import { PluginsManager, PluginSpecsList } from '../plugins';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';
import { WebToApi } from '../webtoapi';

class DRCollectorClass {
    //
    // Protected class properties.
    protected static _Instance: DRCollectorClass = null;
    //
    // Protected properties.
    protected _configsManagers: BasicList<ConfigsManager> = [];
    protected _endpointsManager: BasicList<EndpointsManager> = [];
    protected _infoReport: any = null;
    protected _loadersManagers: BasicList<LoadersManager> = [];
    protected _middlewaresManager: BasicList<MiddlewaresManager> = [];
    protected _mockRoutesManager: BasicList<MockRoutesManager> = [];
    protected _mySQLRestManager: BasicList<MySQLRestManager> = [];
    protected _pluginsManager: BasicList<PluginsManager> = [];
    protected _routesManager: BasicList<RoutesManager> = [];
    protected _tasksManager: BasicList<TasksManager> = [];
    protected _webToApi: BasicList<WebToApi> = [];
    //
    // Events.
    protected _events: EventEmitter = new EventEmitter();
    //
    // Constructor.
    protected constructor() {
    }
    //
    // Public methods.
    public configsManagers(): BasicList<ConfigsManager> {
        return this._configsManagers;
    }
    public endpointsManagers(): BasicList<EndpointsManager> {
        return this._endpointsManager;
    }
    public infoReport(): any {
        if (!this._infoReport) {
            this._infoReport = {
                configs: this.infoReportConfigsManager(),
                endpoints: this.infoReportEndpointsManager(),
                loaders: this.infoReportLoadersManager(),
                middlewares: this.infoReportMiddlewaresManager(),
                mockRoutes: this.infoReportMockRoutesManager(),
                mysqlRest: this.infoReportMySQLRestManager(),
                plugins: this.infoReportPluginsManager(),
                routes: this.infoReportRoutesManager(),
                tasks: this.infoReportTasksManager(),
                webtoapi: this.infoReportWebToApi()
            };
        }

        return Tools.DeepCopy(this._infoReport);
    }
    public loadersManagers(): BasicList<LoadersManager> {
        return this._loadersManagers;
    }
    public middlewaresManagers(): BasicList<MiddlewaresManager> {
        return this._middlewaresManager;
    }
    public mockRoutesManagers(): BasicList<MockRoutesManager> {
        return this._mockRoutesManager;
    }
    public mySQLRestManagers(): BasicList<MySQLRestManager> {
        return this._mySQLRestManager;
    }
    public on(event: string, listener: any): void {
        this._events.on(event, listener);
    }
    public pluginsManagers(): BasicList<PluginsManager> {
        return this._pluginsManager;
    }
    public registerConfigsManager(manager: ConfigsManager): void {
        if (this._configsManagers.indexOf(manager) < 0) {
            this._configsManagers.push(manager);
            this._infoReport = null;

            const eventData: any = {
                configsManager: manager
            };
            this._events.emit(DRCollectorEvents.ConfigsManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerEndpointsManager(manager: EndpointsManager): void {
        if (this._endpointsManager.indexOf(manager) < 0) {
            this._endpointsManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                endpointsManager: manager
            };
            this._events.emit(DRCollectorEvents.EndpointsManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerLoadersManager(manager: LoadersManager): void {
        if (this._loadersManagers.indexOf(manager) < 0) {
            this._loadersManagers.push(manager);
            this._infoReport = null;

            const eventData: any = {
                loadersManager: manager
            };
            this._events.emit(DRCollectorEvents.LoadersManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerMiddlewaresManager(manager: MiddlewaresManager): void {
        if (this._middlewaresManager.indexOf(manager) < 0) {
            this._middlewaresManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                middlewaresManager: manager
            };
            this._events.emit(DRCollectorEvents.MiddlewaresManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerMockRoutesManager(manager: MockRoutesManager): void {
        if (this._mockRoutesManager.indexOf(manager) < 0) {
            this._mockRoutesManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                mockRoutesManager: manager
            };
            this._events.emit(DRCollectorEvents.MockRoutesManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerMySQLRestManager(manager: MySQLRestManager): void {
        if (this._mySQLRestManager.indexOf(manager) < 0) {
            this._mySQLRestManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                mySQLRestManager: manager
            };
            this._events.emit(DRCollectorEvents.MySQLRestManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerPluginsManager(manager: PluginsManager): void {
        if (this._pluginsManager.indexOf(manager) < 0) {
            this._pluginsManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                pluginsManager: manager
            };
            this._events.emit(DRCollectorEvents.PluginsManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerRoutesManager(manager: RoutesManager): void {
        if (this._routesManager.indexOf(manager) < 0) {
            this._routesManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                routesManager: manager
            };
            this._events.emit(DRCollectorEvents.RoutesManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerTasksManager(manager: TasksManager): void {
        if (this._tasksManager.indexOf(manager) < 0) {
            this._tasksManager.push(manager);
            this._infoReport = null;

            const eventData: any = {
                tasksManager: manager
            };
            this._events.emit(DRCollectorEvents.TasksManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public registerWebToApi(manager: WebToApi): void {
        if (this._webToApi.indexOf(manager) < 0) {
            this._webToApi.push(manager);
            this._infoReport = null;

            const eventData: any = {
                webToApi: manager
            };
            this._events.emit(DRCollectorEvents.WebToApiRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public routesManagers(): BasicList<RoutesManager> {
        return this._routesManager;
    }
    public tasksManagers(): BasicList<TasksManager> {
        return this._tasksManager;
    }
    public webToApi(): BasicList<WebToApi> {
        return this._webToApi;
    }
    //
    // Protected methods.
    protected infoReportConfigsManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._configsManagers) {
            results.push({
                directory: manager.directory(),
                environment: manager.environmentName(),
                items: manager.items(),
                publicUri: manager.publicUri(),
                specsDirectory: manager.specsDirectory(),
                suffix: manager.suffix(),
                publicItemNames: manager.publicItemNames()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportEndpointsManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._endpointsManager) {
            results.push({
                uri: manager.uri(),
                directory: manager.directory(),
                mockups: manager.paths(),
                options: manager.options()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportLoadersManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._loadersManagers) {
            results.push({
                directory: manager.directory(),
                items: manager.items(),
                suffix: manager.suffix()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportMiddlewaresManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._middlewaresManager) {
            results.push({
                directory: manager.directory(),
                items: manager.items(),
                suffix: manager.suffix()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportMockRoutesManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._mockRoutesManager) {
            results.push({
                configPath: manager.configPath(),
                guards: manager.guards(),
                routes: manager.routes()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportMySQLRestManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._mySQLRestManager) {
            results.push(manager.config());
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportPluginsManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._pluginsManager) {
            const pluginInfo: any = {
                directories: manager.directories(),
                plugins: []
            };
            const items: PluginSpecsList = manager.items();
            for (const name of Object.keys(items).sort()) {
                const aux: any = {
                    name,
                    path: items[name].path,
                    methods: manager.methodsOf(name).sort(),
                    configName: manager.configNameOf(name),
                    config: manager.configOf(name)
                };

                if (Object.keys(aux.config).length < 1) {
                    aux.config = null;
                }

                pluginInfo.plugins.push(aux);
            }

            results.push(pluginInfo);
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportRoutesManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._routesManager) {
            results.push({
                directory: manager.directory(),
                items: manager.routes(),
                suffix: manager.suffix()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportTasksManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._tasksManager) {
            results.push({
                directory: manager.directory(),
                items: manager.tasks(),
                suffix: manager.suffix()
            });
        }

        return results.length > 0 ? results : null;
    }
    protected infoReportWebToApi(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._webToApi) {
            results.push({
                name: manager.name(),
                description: manager.description(),
                configPath: manager.configPath(),
                endpoints: manager.endpoints(),
                cachePath: manager.cachePath(),
                cacheLifetime: manager.cacheLifetime(),
                relativePath: manager.relativePath(),
                parsers: manager.parsers(),
                customParsers: manager.customParsers(),
                routes: manager.routes()
            });
        }

        return results.length > 0 ? results : null;
    }
    //
    // Protected methods.

    //
    // Public class methods.
    public static Instance(): DRCollectorClass {
        if (!DRCollectorClass._Instance) {
            DRCollectorClass._Instance = new DRCollectorClass();
        }

        return DRCollectorClass._Instance;
    }
}

export const DRCollector = DRCollectorClass.Instance();
