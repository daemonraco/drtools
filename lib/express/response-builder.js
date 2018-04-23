"use strict";
/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const marked = require("marked");
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
    static DocsContents(doc, baseUrl) {
        let result = { doc };
        const rootPath = path.join(__dirname, '../..');
        result.path = path.join(rootPath, doc);
        if (fs.existsSync(result.path)) {
            result.raw = fs.readFileSync(result.path).toString();
            marked.setOptions({
                headerIds: true,
                tables: true,
                gfm: true
            });
            result.html = ExpressResponseBuilder.CleanMDHtmlLinks(rootPath, result.path, marked(result.raw));
        }
        return result;
    }
    static FullInfoResponse(managers) {
        const { configs, endpoints, loaders, middlewares, mockRoutes, routes, tasks } = managers;
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
        results.mockRoutes = null;
        if (mockRoutes) {
            results.mockRoutes = {
                configPath: mockRoutes.configPath(),
                routes: mockRoutes.routes()
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
                results.endpoints.push({
                    uri: endpoint.uri(),
                    directory: endpoint.directory(),
                    mockups: endpoint.paths(),
                    options: endpoint.options()
                });
            });
        }
        else {
            results.endpoints = null;
        }
        return results;
    }
    //
    // Protected class methods.
    static CleanMDHtmlLinks(rootPath, docPath, html) {
        const pattern = /^(.* href=")(.*)(\.md.*)$/;
        const docDirname = path.dirname(docPath);
        html = html.split('\n')
            .map((line) => {
            let matches = line.match(pattern);
            if (matches) {
                const newPath = path.resolve(path.join(docDirname, matches[2])).substr(rootPath.length + 1);
                line = `${matches[1]}${newPath}${matches[3]}`;
            }
            return line;
        }).join('\n');
        return html;
    }
}
exports.ExpressResponseBuilder = ExpressResponseBuilder;
