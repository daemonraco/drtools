/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { RoutesConstants } from './constants';
import { Tools } from '../includes/tools';

export type RoutesList = { [name: string]: any };
export interface RouteOptions {
    suffix?: string;
    verbose?: boolean;
}

export class RoutesManager {
    //
    // Protected properties.
    protected _routesDirectory: string = null;
    protected _options: RouteOptions = null;
    //
    // Constructor.
    constructor(app: any, routesDirectory: string, options: RouteOptions = {}) {
        this._options = options;
        this.cleanOptions();

        this.load(app, routesDirectory);
    }
    //
    // Public methods.

    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: RouteOptions = {
            suffix: RoutesConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load(app: any, routesDirectory: string) {
        let error: boolean = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(routesDirectory); } catch (e) { }
            if (!stat) {
                console.error(`'${routesDirectory}' does not exist.`);
                error = true;
            } else if (!stat.isDirectory()) {
                console.error(`'${routesDirectory}' is not a directory.`);
                error = true;
            }
        }

        let routes: any[] = [];
        if (!error) {
            //
            // Basic paths and patterns.
            this._routesDirectory = routesDirectory;
            const routesPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);

            routes = fs.readdirSync(this._routesDirectory)
                .filter(x => x.match(routesPattern))
                .map(x => {
                    const o: any = {
                        name: x.replace(routesPattern, '$1'),
                        path: path.join(this._routesDirectory, x)
                    };
                    o.uri = `/${o.name}`;

                    return o;
                });
        }

        if (!error && routes.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading routes:`);
            }

            for (let i in routes) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(routes[i].name)}'`);
                    }

                    app.use(routes[i].uri, require(routes[i].path));
                } catch (e) {
                    console.error(chalk.red(`Unable to load route '${routes[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
