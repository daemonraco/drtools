/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */

import { chalk, EventEmitter } from '../../libraries';

import { BasicList, Tools } from '../includes';
import { ConfigsManager } from '../configs';
import { DRCollectorConstants, DRCollectorManagers, DRCollectorEvents } from './constants';
import { EndpointsManager } from '../mock-endpoints';
import { IAsyncManager, IManagerByKey } from './types';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { PluginsManager, IPluginSpecsList } from '../plugins';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';

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
    protected _pluginsManager: BasicList<PluginsManager> = [];
    protected _routesManager: BasicList<RoutesManager> = [];
    protected _tasksManager: BasicList<TasksManager> = [];
    //
    // Events.
    protected _events: EventEmitter = new EventEmitter();
    //
    // Constructor.
    protected constructor() {
    }
    //
    // Public methods.
    public configsManager(key: string): ConfigsManager {
        return <ConfigsManager>this.findManager(this.configsManagers(), key);
    }
    public configsManagers(): BasicList<ConfigsManager> {
        return this._configsManagers;
    }
    public endpointsManager(key: string): EndpointsManager {
        return <EndpointsManager>this.findManager(this.endpointsManagers(), key);
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
                plugins: this.infoReportPluginsManager(),
                routes: this.infoReportRoutesManager(),
                tasks: this.infoReportTasksManager(),
            };
        }

        return Tools.DeepCopy(this._infoReport);
    }
    public loadersManager(key: string): LoadersManager {
        return <LoadersManager>this.findManager(this.loadersManagers(), key);
    }
    public loadersManagers(): BasicList<LoadersManager> {
        return this._loadersManagers;
    }
    public middlewaresManager(key: string): MiddlewaresManager {
        return <MiddlewaresManager>this.findManager(this.middlewaresManagers(), key);
    }
    public middlewaresManagers(): BasicList<MiddlewaresManager> {
        return this._middlewaresManager;
    }
    public mockRoutesManager(key: string): MockRoutesManager {
        return <MockRoutesManager>this.findManager(this.mockRoutesManagers(), key);
    }
    public mockRoutesManagers(): BasicList<MockRoutesManager> {
        return this._mockRoutesManager;
    }
    public on(event: string, listener: any): void {
        this._events.on(event, listener);
    }
    public pluginsManager(key: string): PluginsManager {
        return <PluginsManager>this.findManager(this.pluginsManagers(), key);
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

            this.monitorAsyncManagerLoading(DRCollectorManagers.Loader, manager);

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

            this.monitorAsyncManagerLoading(DRCollectorManagers.Middlewares, manager);

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
    public registerPluginsManager(manager: PluginsManager): void {
        if (this._pluginsManager.indexOf(manager) < 0) {
            this._pluginsManager.push(manager);
            this._infoReport = null;

            this.monitorAsyncManagerLoading(DRCollectorManagers.Plugins, manager);

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

            this.monitorAsyncManagerLoading(DRCollectorManagers.Routes, manager);

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

            this.monitorAsyncManagerLoading(DRCollectorManagers.Tasks, manager);

            const eventData: any = {
                tasksManager: manager
            };
            this._events.emit(DRCollectorEvents.TasksManagerRegistered, eventData);
            this._events.emit(DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    public routesManager(key: string): RoutesManager {
        return <RoutesManager>this.findManager(this.routesManagers(), key);
    }
    public routesManagers(): BasicList<RoutesManager> {
        return this._routesManager;
    }
    public tasksManager(key: string): TasksManager {
        return <TasksManager>this.findManager(this.tasksManagers(), key);
    }
    public tasksManagers(): BasicList<TasksManager> {
        return this._tasksManager;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected findManager(managers: BasicList<IManagerByKey>, key: string): IManagerByKey {
        let manager: IManagerByKey = null;

        for (const m of managers) {
            if (m.matchesKey(key)) {
                manager = m;
                break;
            }
        }

        return manager;
    }
    /* istanbul ignore next */
    protected infoReportConfigsManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._configsManagers) {
            results.push({
                key: manager.key(),
                directories: manager.directories(),
                environment: manager.environmentName(),
                items: manager.items(),
                publicUri: manager.publicUri(),
                specsDirectories: manager.specsDirectories(),
                specs: manager.specs(),
                suffix: manager.suffix(),
                specsSuffix: manager.specsSuffix(),
                publicItemNames: manager.publicItemNames(),
                options: manager.options(),
            });
        }

        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    protected infoReportPluginsManager(): BasicList<any> {
        const results: BasicList<any> = [];

        for (const manager of this._pluginsManager) {
            const pluginInfo: any = {
                directory: manager.directory(),
                plugins: []
            };
            const items: IPluginSpecsList = manager.items();
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    protected monitorAsyncManagerLoading(type: string, manager: IAsyncManager): void {
        setTimeout(() => {
            if (!manager.loaded()) {
                console.error(chalk.red(`A manager of type '${type}' is still waiting to be initialized`));
            }
        }, DRCollectorConstants.AsyncLoadingTimeout);
    }
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
