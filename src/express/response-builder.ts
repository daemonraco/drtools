/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */

import * as fs from 'fs';
import * as glob from 'glob';
import * as marked from 'marked';
import * as path from 'path';

import { ConfigItemSpec, ConfigsManager } from '../configs';
import { EndpointsManager } from '../mock-endpoints';
import { ExpressConnectorAttachResults } from '.';
import { Tools } from '../includes';

export class ExpressResponseBuilder {
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public class methods.
    public static ConfigContents(manager: ConfigsManager, name: string): any {
        let result: any = {};

        if (manager) {
            let item: ConfigItemSpec = null;
            manager.items().forEach((auxItem: ConfigItemSpec) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item) {
                result = Tools.DeepCopy(item);
                result.contents = manager.get(item.name);
            }
        }

        return result;
    }
    public static ConfigSpecsContents(manager: ConfigsManager, name: string): any {
        let result: any = {};

        if (manager) {
            let item: ConfigItemSpec = null;
            manager.items().forEach((auxItem: ConfigItemSpec) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item && item.specsPath) {
                result = Tools.DeepCopy(item);
                result.contents = manager.getSpecs(item.name);
            }
        }

        return result;
    }
    public static DocsContents(doc: string, baseUrl: string): any {
        let result: any = { doc };

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
    public static FullInfoResponse(managers: ExpressConnectorAttachResults): any {
        const { configs, endpoints, loaders, middlewares, mockRoutes, routes, tasks } = managers;
        let results: any = {};

        results.configs = null;
        if (configs) {
            const publicConfigs: string[] = configs.publicItemNames();
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

            endpoints.forEach((endpoint: EndpointsManager) => {
                results.endpoints.push({
                    uri: endpoint.uri(),
                    directory: endpoint.directory(),
                    mockups: endpoint.paths(),
                    options: endpoint.options()
                });
            });
        } else {
            results.endpoints = null;
        }

        return results;
    }
    //
    // Protected class methods.
    protected static CleanMDHtmlLinks(rootPath: string, docPath: string, html: string): string {
        const pattern: RegExp = /^(.* href=")(.*)(\.md.*)$/;
        const docDirname = path.dirname(docPath);

        html = html.split('\n')
            .map((line: string) => {
                let matches: any[] = line.match(pattern);

                if (matches) {
                    const newPath = path.resolve(path.join(docDirname, matches[2])).substr(rootPath.length + 1);
                    line = `${matches[1]}${newPath}${matches[3]}`;
                }

                return line;
            }).join('\n');

        return html;
    }
}
