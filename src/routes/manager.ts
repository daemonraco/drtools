/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { RoutesConstants } from '.';
import { Tools } from '../includes';

export type RoutesList = { [name: string]: any };
export interface RouteOptions {
    suffix?: string;
    verbose?: boolean;
}

declare const global: any;

export class RoutesManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directory: string = null;
    protected _lastError: string = null;
    protected _options: RouteOptions = null;
    protected _routes: any[] = [];
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(app: any, directory: string, options: RouteOptions = {}, configs: ConfigsManager) {
        this._configs = configs;
        this._options = options;
        this.cleanOptions();

        this.load(app, directory);
    }
    //
    // Public methods.
    public directory(): string {
        return this._directory;
    }
    public lastError(): string {
        return this._lastError;
    }
    public routes(): string[] {
        return this._routes.map((r: any) => r.name);
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: RouteOptions = {
            suffix: RoutesConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load(app: any, directory: string) {
        if (this._options.verbose) {
            console.log(`Loading routes:`);
        }
        //
        // Checking given directory path.
        let stat: any = null;
        try { stat = fs.statSync(directory); } catch (e) { }
        if (!stat) {
            this._lastError = `'${directory}' does not exist.`;
            console.error(chalk.red(this._lastError));
        } else if (!stat.isDirectory()) {
            this._lastError = `'${directory}' is not a directory.`;
            console.error(chalk.red(this._lastError));
        }

        if (!this._lastError) {
            //
            // Basic paths and patterns.
            this._directory = directory;
            const routesPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);

            this._routes = fs.readdirSync(this._directory)
                .filter(x => x.match(routesPattern))
                .map(x => {
                    const o: any = {
                        name: x.replace(routesPattern, '$1'),
                        path: path.join(this._directory, x)
                    };
                    o.uri = `/${o.name}`;

                    return o;
                });
        }

        if (!this._lastError && this._routes.length > 0) {
            for (let i in this._routes) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._routes[i].name)}'`);
                    }

                    global.configs = this._configs;
                    app.use(this._routes[i].uri, require(this._routes[i].path));
                    delete global.configs;
                } catch (e) {
                    console.error(chalk.red(`Unable to load route '${this._routes[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
