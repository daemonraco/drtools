"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRCollector = void 0;
const tslib_1 = require("tslib");
/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */
const includes_1 = require("../includes");
const constants_1 = require("./constants");
const events_1 = require("events");
const os = tslib_1.__importStar(require("os"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
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
        this._pluginsManager = [];
        this._routesManager = [];
        this._tasksManager = [];
        //
        // Events.
        this._events = new events_1.EventEmitter();
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
                $system: this.infoReportSystem(),
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
    //
    // Protected methods.
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    infoReportConfigsManager() {
        const results = [];
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
    infoReportEndpointsManager() {
        const results = [];
        for (const manager of this._endpointsManager) {
            results.push({
                uri: manager.uri(),
                directory: manager.directory(),
                mockups: manager.paths(),
                options: manager.options(),
            });
        }
        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
    infoReportLoadersManager() {
        const results = [];
        for (const manager of this._loadersManagers) {
            results.push({
                directories: manager.directories(),
                items: manager.items(),
                suffix: manager.suffix(),
                options: manager.options(),
            });
        }
        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
    infoReportMiddlewaresManager() {
        const results = [];
        for (const manager of this._middlewaresManager) {
            results.push({
                directories: manager.directories(),
                items: manager.items(),
                suffix: manager.suffix(),
                options: manager.options(),
            });
        }
        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
    infoReportMockRoutesManager() {
        const results = [];
        for (const manager of this._mockRoutesManager) {
            results.push({
                configPath: manager.configPath(),
                guards: manager.guards(),
                routes: manager.routes(),
                options: manager.options(),
            });
        }
        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
    infoReportPluginsManager() {
        const results = [];
        for (const manager of this._pluginsManager) {
            const pluginInfo = {
                directories: manager.directories(),
                plugins: [],
                options: manager.options(),
            };
            const items = manager.items();
            for (const name of Object.keys(items).sort()) {
                const aux = {
                    name,
                    path: items[name].path,
                    methods: manager.methodsOf(name).sort(),
                    configName: manager.configNameOf(name),
                    config: manager.configOf(name),
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
    infoReportRoutesManager() {
        const results = [];
        for (const manager of this._routesManager) {
            results.push({
                directories: manager.directories(),
                items: manager.routes(),
                suffix: manager.suffix(),
                options: manager.options(),
            });
        }
        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
    infoReportSystem() {
        return {
            arch: os.arch(),
            osVersion: os.version(),
            platform: os.platform(),
            release: os.release(),
            type: os.type(),
            version: includes_1.Tools.Version(),
        };
    }
    /* istanbul ignore next */
    infoReportTasksManager() {
        const results = [];
        for (const manager of this._tasksManager) {
            results.push({
                directories: manager.directories(),
                items: manager.tasks(),
                suffix: manager.suffix(),
                options: manager.options(),
            });
        }
        return results.length > 0 ? results : null;
    }
    /* istanbul ignore next */
    monitorAsyncManagerLoading(type, manager) {
        setTimeout(() => {
            if (!manager.loaded()) {
                console.error(chalk_1.default.red(`A manager of type '${type}' is still waiting to be initialized`));
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
