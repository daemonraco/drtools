"use strict";
/**
 * @file drcollector.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const includes_1 = require("../includes");
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
        this._webToApi = [];
    }
    //
    // Public methods.
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
    registerConfigsManager(manager) {
        if (this._configsManagers.indexOf(manager) < 0) {
            this._configsManagers.push(manager);
            this._infoReport = null;
        }
    }
    registerEndpointsManager(manager) {
        if (this._endpointsManager.indexOf(manager) < 0) {
            this._endpointsManager.push(manager);
            this._infoReport = null;
        }
    }
    registerLoadersManager(manager) {
        if (this._loadersManagers.indexOf(manager) < 0) {
            this._loadersManagers.push(manager);
            this._infoReport = null;
        }
    }
    registerMiddlewaresManager(manager) {
        if (this._middlewaresManager.indexOf(manager) < 0) {
            this._middlewaresManager.push(manager);
            this._infoReport = null;
        }
    }
    registerMockRoutesManager(manager) {
        if (this._mockRoutesManager.indexOf(manager) < 0) {
            this._mockRoutesManager.push(manager);
            this._infoReport = null;
        }
    }
    registerMySQLRestManager(manager) {
        if (this._mySQLRestManager.indexOf(manager) < 0) {
            this._mySQLRestManager.push(manager);
            this._infoReport = null;
        }
    }
    registerPluginsManager(manager) {
        if (this._pluginsManager.indexOf(manager) < 0) {
            this._pluginsManager.push(manager);
            this._infoReport = null;
        }
    }
    registerRoutesManager(manager) {
        if (this._routesManager.indexOf(manager) < 0) {
            this._routesManager.push(manager);
            this._infoReport = null;
        }
    }
    registerTasksManager(manager) {
        if (this._tasksManager.indexOf(manager) < 0) {
            this._tasksManager.push(manager);
            this._infoReport = null;
        }
    }
    registerWebToApi(manager) {
        if (this._webToApi.indexOf(manager) < 0) {
            this._webToApi.push(manager);
            this._infoReport = null;
        }
    }
    //
    // Protected methods.
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
                directories: manager.directories(),
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
