/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs/manager';
import { LoadersConstants } from './constants';
import { Tools } from '../includes/tools';

export type LoadersList = { [name: string]: any };
export interface LoaderOptions {
    suffix?: string;
    verbose?: boolean;
}

declare const global: any;

export class LoadersManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _loadersDirectory: string = null;
    protected _options: LoaderOptions = null;
    //
    // Constructor.
    constructor(loadersDirectory: string, options: LoaderOptions = {}, configs: ConfigsManager) {
        this._configs = configs;
        this._options = options;
        this.cleanOptions();

        this.load(loadersDirectory);
    }
    //
    // Public methods.

    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: LoaderOptions = {
            suffix: LoadersConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load(loadersDirectory: string) {
        let error: boolean = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(loadersDirectory); } catch (e) { }
            if (!stat) {
                console.error(`'${loadersDirectory}' does not exist.`);
                error = true;
            } else if (!stat.isDirectory()) {
                console.error(`'${loadersDirectory}' is not a directory.`);
                error = true;
            }
        }

        let loaders: any[] = [];
        if (!error) {
            //
            // Basic paths and patterns.
            this._loadersDirectory = loadersDirectory;
            const loadersPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);

            loaders = fs.readdirSync(this._loadersDirectory)
                .filter(x => x.match(loadersPattern))
                .map(x => {
                    return {
                        name: x.replace(loadersPattern, '$1'),
                        path: path.join(this._loadersDirectory, x)
                    };
                });
        }

        if (!error && loaders.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading loaders:`);
            }

            for (let i in loaders) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(loaders[i].name)}'`);
                    }

                    global.configs = this._configs;
                    require(loaders[i].path);
                    delete global.configs;
                } catch (e) {
                    console.error(chalk.red(`Unable to load loader '${loaders[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
