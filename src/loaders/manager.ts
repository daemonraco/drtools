/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { LoadersConstants } from '.';
import { Tools } from '../includes';

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
    protected _lastError: string = null;
    protected _loadersDirectory: string = null;
    protected _options: LoaderOptions = null;
    protected _valid: boolean = false;
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
    public lastError(): string {
        return this._lastError;
    }
    public valid(): boolean {
        return this._valid;
    }
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
        this._lastError = null;
        //
        // Checking given directory path.
        if (!this._lastError) {
            let stat: any = null;
            try { stat = fs.statSync(loadersDirectory); } catch (e) { }
            if (!stat) {
                this._lastError = `'${loadersDirectory}' does not exist.`;
                console.error(this._lastError);
            } else if (!stat.isDirectory()) {
                this._lastError = `'${loadersDirectory}' is not a directory.`;
                console.error(this._lastError);
            }
        }

        let loaders: any[] = [];
        if (!this._lastError) {
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

        if (!this._lastError && loaders.length > 0) {
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

        this._valid = !this._lastError;
    }
}
