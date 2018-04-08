/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs/manager';
import { MiddlewaresConstants } from './constants';
import { Tools } from '../includes/tools';

export type MiddlewaresList = { [name: string]: any };
export interface MiddlewareOptions {
    suffix?: string;
    verbose?: boolean;
}

export class MiddlewaresManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _middlewaresDirectory: string = null;
    protected _options: MiddlewareOptions = null;
    //
    // Constructor.
    constructor(app: any, middlewaresDirectory: string, options: MiddlewareOptions = {}, configs: ConfigsManager) {
        this._configs = configs;
        this._options = options;
        this.cleanOptions();

        this.load(app, middlewaresDirectory);
    }
    //
    // Public methods.

    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: MiddlewareOptions = {
            suffix: MiddlewaresConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load(app: any, middlewaresDirectory: string) {
        let error: boolean = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(middlewaresDirectory); } catch (e) { }
            if (!stat) {
                console.error(`'${middlewaresDirectory}' does not exist.`);
                error = true;
            } else if (!stat.isDirectory()) {
                console.error(`'${middlewaresDirectory}' is not a directory.`);
                error = true;
            }
        }

        let middlewares: any[] = [];
        if (!error) {
            //
            // Basic paths and patterns.
            this._middlewaresDirectory = middlewaresDirectory;
            const middlewaresPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);

            middlewares = fs.readdirSync(this._middlewaresDirectory)
                .filter(x => x.match(middlewaresPattern))
                .map(x => {
                    return {
                        name: x.replace(middlewaresPattern, '$1'),
                        path: path.join(this._middlewaresDirectory, x)
                    };
                });
        }

        if (!error && middlewares.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading middlewares:`);
            }

            for (let i in middlewares) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(middlewares[i].name)}'`);
                    }

                    app.use(require(middlewares[i].path));
                } catch (e) {
                    console.error(chalk.red(`Unable to load middleware '${middlewares[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
