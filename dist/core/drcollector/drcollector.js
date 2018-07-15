"use strict";
/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const includes_1 = require("../includes");
const constants_1 = require("./constants");
class DRCollectorClass {
    //
    // Constructor.
    constructor() {
        //
        // Protected properties.
        this._configsManagers = [];
        this._endpointsManager = [];
        this._infoReport = null;
        this._loadersManagers = [];
        this._middlewaresManager = [];
        this._mockRoutesManager = [];
        this._mySQLRestManager = [];
        this._pluginsManager = [];
        this._routesManager = [];
        this._tasksManager = [];
        this._webToApiManagers = [];
        //
        // Events.
        this._events = new libraries_1.EventEmitter();
    }
    //
    // Public methods.
    configsManager(key) {
        return this.findManager(this.configsManagers(), key);
    }
    configsManagers() {
        return this._configsManagers;
    }
    endpointsManager(key) {
        return this.findManager(this.endpointsManagers(), key);
    }
    endpointsManagers() {
        return this._endpointsManager;
    }
    infoReport() {
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
        return includes_1.Tools.DeepCopy(this._infoReport);
    }
    loadersManager(key) {
        return this.findManager(this.loadersManagers(), key);
    }
    loadersManagers() {
        return this._loadersManagers;
    }
    middlewaresManager(key) {
        return this.findManager(this.middlewaresManagers(), key);
    }
    middlewaresManagers() {
        return this._middlewaresManager;
    }
    mockRoutesManager(key) {
        return this.findManager(this.mockRoutesManagers(), key);
    }
    mockRoutesManagers() {
        return this._mockRoutesManager;
    }
    mySQLRestManagers() {
        return this._mySQLRestManager;
    }
    on(event, listener) {
        this._events.on(event, listener);
    }
    pluginsManager(key) {
        return this.findManager(this.pluginsManagers(), key);
    }
    pluginsManagers() {
        return this._pluginsManager;
    }
    registerConfigsManager(manager) {
        if (this._configsManagers.indexOf(manager) < 0) {
            this._configsManagers.push(manager);
            this._infoReport = null;
            const eventData = {
                configsManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.ConfigsManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerEndpointsManager(manager) {
        if (this._endpointsManager.indexOf(manager) < 0) {
            this._endpointsManager.push(manager);
            this._infoReport = null;
            const eventData = {
                endpointsManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.EndpointsManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerLoadersManager(manager) {
        if (this._loadersManagers.indexOf(manager) < 0) {
            this._loadersManagers.push(manager);
            this._infoReport = null;
            this.monitorAsyncManagerLoading(constants_1.DRCollectorManagers.Loader, manager);
            const eventData = {
                loadersManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.LoadersManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerMiddlewaresManager(manager) {
        if (this._middlewaresManager.indexOf(manager) < 0) {
            this._middlewaresManager.push(manager);
            this._infoReport = null;
            this.monitorAsyncManagerLoading(constants_1.DRCollectorManagers.Middlewares, manager);
            const eventData = {
                middlewaresManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.MiddlewaresManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerMockRoutesManager(manager) {
        if (this._mockRoutesManager.indexOf(manager) < 0) {
            this._mockRoutesManager.push(manager);
            this._infoReport = null;
            const eventData = {
                mockRoutesManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.MockRoutesManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerMySQLRestManager(manager) {
        if (this._mySQLRestManager.indexOf(manager) < 0) {
            this._mySQLRestManager.push(manager);
            this._infoReport = null;
            const eventData = {
                mySQLRestManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.MySQLRestManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerPluginsManager(manager) {
        if (this._pluginsManager.indexOf(manager) < 0) {
            this._pluginsManager.push(manager);
            this._infoReport = null;
            this.monitorAsyncManagerLoading(constants_1.DRCollectorManagers.Plugins, manager);
            const eventData = {
                pluginsManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.PluginsManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerRoutesManager(manager) {
        if (this._routesManager.indexOf(manager) < 0) {
            this._routesManager.push(manager);
            this._infoReport = null;
            this.monitorAsyncManagerLoading(constants_1.DRCollectorManagers.Routes, manager);
            const eventData = {
                routesManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.RoutesManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerTasksManager(manager) {
        if (this._tasksManager.indexOf(manager) < 0) {
            this._tasksManager.push(manager);
            this._infoReport = null;
            this.monitorAsyncManagerLoading(constants_1.DRCollectorManagers.Tasks, manager);
            const eventData = {
                tasksManager: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.TasksManagerRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    registerWebToApiManager(manager) {
        if (this._webToApiManagers.indexOf(manager) < 0) {
            this._webToApiManagers.push(manager);
            this._infoReport = null;
            const eventData = {
                webToApi: manager
            };
            this._events.emit(constants_1.DRCollectorEvents.WebToApiRegistered, eventData);
            this._events.emit(constants_1.DRCollectorEvents.ManagerRegistered, eventData);
        }
    }
    routesManager(key) {
        return this.findManager(this.routesManagers(), key);
    }
    routesManagers() {
        return this._routesManager;
    }
    tasksManager(key) {
        return this.findManager(this.tasksManagers(), key);
    }
    tasksManagers() {
        return this._tasksManager;
    }
    webToApiManager(key) {
        return this.findManager(this.webToApiManagers(), key);
    }
    webToApiManagers() {
        return this._webToApiManagers;
    }
    //
    // Protected methods.
    findManager(managers, key) {
        let manager = null;
        for (const m of managers) {
            if (m.matchesKey(key)) {
                manager = m;
                break;
            }
        }
        return manager;
    }
    infoReportConfigsManager() {
        const results = [];
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
    infoReportEndpointsManager() {
        const results = [];
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
    infoReportLoadersManager() {
        const results = [];
        for (const manager of this._loadersManagers) {
            results.push({
                directory: manager.directory(),
                items: manager.items(),
                suffix: manager.suffix()
            });
        }
        return results.length > 0 ? results : null;
    }
    infoReportMiddlewaresManager() {
        const results = [];
        for (const manager of this._middlewaresManager) {
            results.push({
                directory: manager.directory(),
                items: manager.items(),
                suffix: manager.suffix()
            });
        }
        return results.length > 0 ? results : null;
    }
    infoReportMockRoutesManager() {
        const results = [];
        for (const manager of this._mockRoutesManager) {
            results.push({
                configPath: manager.configPath(),
                guards: manager.guards(),
                routes: manager.routes()
            });
        }
        return results.length > 0 ? results : null;
    }
    infoReportMySQLRestManager() {
        const results = [];
        for (const manager of this._mySQLRestManager) {
            results.push(manager.config());
        }
        return results.length > 0 ? results : null;
    }
    infoReportPluginsManager() {
        const results = [];
        for (const manager of this._pluginsManager) {
            const pluginInfo = {
                directory: manager.directory(),
                plugins: []
            };
            const items = manager.items();
            for (const name of Object.keys(items).sort()) {
                const aux = {
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
    infoReportRoutesManager() {
        const results = [];
        for (const manager of this._routesManager) {
            results.push({
                directory: manager.directory(),
                items: manager.routes(),
                suffix: manager.suffix()
            });
        }
        return results.length > 0 ? results : null;
    }
    infoReportTasksManager() {
        const results = [];
        for (const manager of this._tasksManager) {
            results.push({
                directory: manager.directory(),
                items: manager.tasks(),
                suffix: manager.suffix()
            });
        }
        return results.length > 0 ? results : null;
    }
    infoReportWebToApi() {
        const results = [];
        for (const manager of this._webToApiManagers) {
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
    monitorAsyncManagerLoading(type, manager) {
        setTimeout(() => {
            if (!manager.loaded()) {
                console.error(libraries_1.chalk.red(`A manager of type '${type}' is still waiting to be initialized`));
            }
        }, constants_1.DRCollectorConstants.AsyncLoadingTimeout);
    }
    //
    // Public class methods.
    static Instance() {
        if (!DRCollectorClass._Instance) {
            DRCollectorClass._Instance = new DRCollectorClass();
        }
        return DRCollectorClass._Instance;
    }
}
//
// Protected class properties.
DRCollectorClass._Instance = null;
exports.DRCollector = DRCollectorClass.Instance();
