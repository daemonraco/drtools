"use strict";
/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const includes_1 = require("../includes");
class ExpressResponseBuilder {
    //
    // Constructor.
    constructor() {
    }
    //
    // Public class methods.
    static ConfigContents(manager, name) {
        let result = {};
        if (manager) {
            let item = null;
            manager.items().forEach((auxItem) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item) {
                result = includes_1.Tools.DeepCopy(item);
                result.contents = manager.get(item.name);
            }
        }
        return result;
    }
    static ConfigSpecsContents(manager, name) {
        let result = {};
        if (manager) {
            let item = null;
            manager.items().forEach((auxItem) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item && item.specsPath) {
                result = includes_1.Tools.DeepCopy(item);
                result.contents = manager.getSpecs(item.name);
            }
        }
        return result;
    }
    static FullInfoResponse(managers) {
        const { configs, endpoints, loaders, middlewares, routes, tasks } = managers;
        let results = {};
        results.configs = null;
        if (configs) {
            const publicConfigs = configs.publicItemNames();
            results.configs = {
                directory: configs.directory(),
                environment: configs.environmentName(),
                items: configs.items(),
                publicUri: configs.publicUri(),
                specsDirectory: configs.specsDirectory(),
                suffix: configs.suffix()
            };
        }
        results.loaders = null;
        if (loaders) {
            results.loaders = {
                directory: loaders.directory(),
                items: loaders.items(),
                suffix: loaders.suffix()
            };
        }
        results.middlewares = null;
        if (middlewares) {
            results.middlewares = {
                directory: middlewares.directory(),
                items: middlewares.items(),
                suffix: middlewares.suffix()
            };
        }
        results.routes = null;
        if (routes) {
            results.routes = {
                directory: routes.directory(),
                items: routes.routes(),
                suffix: routes.suffix()
            };
        }
        results.tasks = null;
        if (tasks) {
            results.tasks = {
                directory: tasks.directory(),
                items: tasks.tasks(),
                suffix: tasks.suffix()
            };
        }
        if (endpoints && endpoints.length > 0) {
            results.endpoints = [];
            endpoints.forEach((endpoint) => {
                const directory = endpoint.directory();
                const directoryLength = directory.length;
                const mockups = glob.sync(`${directory}/**/*.json`)
                    .map((p) => p.substr(directoryLength))
                    .map((p) => {
                    const jsonPath = path.join(directory, p);
                    const jsPath = jsonPath.replace(/\.json$/, '.js');
                    return {
                        behaviors: fs.existsSync(jsPath),
                        path: jsonPath,
                        uri: p.replace(/\.json$/, '')
                    };
                });
                results.endpoints.push({
                    uri: endpoint.uri(),
                    directory, mockups,
                    options: endpoint.options()
                });
            });
        }
        else {
            results.endpoints = null;
        }
        return results;
    }
}
exports.ExpressResponseBuilder = ExpressResponseBuilder;
