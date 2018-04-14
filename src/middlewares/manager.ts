/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { MiddlewaresConstants } from './constants';
import { Tools } from '../includes';

export type MiddlewaresList = { [name: string]: any };
export interface MiddlewareOptions {
    suffix?: string;
    verbose?: boolean;
}

declare const global: any;

export class MiddlewaresManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directory: string = null;
    protected _lastError: string = null;
    protected _options: MiddlewareOptions = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(app: any, directory: string, options: MiddlewareOptions = {}, configs: ConfigsManager) {
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
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: MiddlewareOptions = {
            suffix: MiddlewaresConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load(app: any, directory: string) {
        if (this._options.verbose) {
            console.log(`Loading middlewares:`);
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

        let middlewares: any[] = [];
        if (!this._lastError) {
            //
            // Basic paths and patterns.
            this._directory = directory;
            const middlewaresPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);

            middlewares = fs.readdirSync(this._directory)
                .filter(x => x.match(middlewaresPattern))
                .map(x => {
                    return {
                        name: x.replace(middlewaresPattern, '$1'),
                        path: path.join(this._directory, x)
                    };
                });
        }

        if (!this._lastError && middlewares.length > 0) {
            for (let i in middlewares) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(middlewares[i].name)}'`);
                    }

                    global.configs = this._configs;
                    app.use(require(middlewares[i].path));
                    delete global.configs;
                } catch (e) {
                    console.error(chalk.red(`Unable to load middleware '${middlewares[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
