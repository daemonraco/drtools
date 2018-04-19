/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */

import * as fs from 'fs';
import * as glob from 'glob';
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
    public static FullInfoResponse(managers: ExpressConnectorAttachResults): any {
        const { configs, endpoints, loaders, middlewares, routes, tasks } = managers;
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
                const directory = endpoint.directory();
                const directoryLength = directory.length;
                const mockups = glob.sync(`${directory}/**/*.json`)
                    .map((p: any) => p.substr(directoryLength))
                    .map((p: any) => {
                        const jsonPath: string = path.join(directory, p);
                        const jsPath: string = jsonPath.replace(/\.json$/, '.js');
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
        } else {
            results.endpoints = null;
        }

        return results;
    }
}
