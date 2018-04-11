/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as jsonpath from 'jsonpath-plus';
import * as path from 'path';

import { ConfigsConstants } from '.';
import { ExpressMiddleware } from '../express';
import { OptionsList, Tools } from '../includes';

export type ConfigsList = { [name: string]: any };
export interface ConfigOptions {
    suffix?: string;
    verbose?: boolean;
}

declare const global: any;
declare const process: any;

export class ConfigsManager {
    //
    // Protected properties.
    protected _configs: ConfigsList = {};
    protected _configsDirectory: string = null;
    protected _environmentName: string = null;
    protected _exports: ConfigsList = {};
    protected _lastError: string = null;
    protected _options: ConfigOptions = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    public constructor(configsDirectory: string, options: ConfigOptions = {}) {
        this._options = options;
        this.cleanOptions();

        this.load(configsDirectory);
    }
    //
    // Public methods.
    public configsDirectory(): string {
        return this._configsDirectory;
    }
    public environmentName(): string {
        return this._environmentName;
    }
    public get(name: string): any {
        return typeof this._configs[name] ? this._configs[name] : {};
    }
    public lastError(): string {
        return this._lastError;
    }
    public publishExports(uri: string = ConfigsConstants.PublishUri): ExpressMiddleware {
        //
        // Cleaning URI @{
        uri = `/${uri}/`;
        [
            ['//', '/']
        ].forEach((pair: any) => {
            while (uri.indexOf(pair[0]) > -1) {
                uri = uri.replace(pair[0], pair[1]);
            }
        });
        uri = uri.substr(0, uri.length - 1);
        uri = uri.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}

        const pattern: RegExp = new RegExp(`^${uri}([\\/]?)(.*)$`);

        return (req: any, res: any, next: () => void) => {
            let responded: boolean = false;

            if (req.originalUrl.match(pattern)) {
                const name: string = req.originalUrl.replace(pattern, '$2');
                if (name) {
                    if (typeof this._exports[name] !== 'undefined') {
                        res.json(this._exports[name]);
                    } else {
                        res.status(404).json({
                            error: true,
                            message: `Unknown exported configuration '${name}'.`
                        });
                    }
                } else {
                    res.json({
                        configs: Object.keys(this._exports)
                    });
                }

                responded = true;
            }

            if (!responded) {
                next();
            }
        };
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: ConfigOptions = {
            suffix: ConfigsConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load(configsDirectory: string): void {
        this._lastError = null;
        //
        // Loading environment names.
        this._environmentName = process.env.ENV_NAME || process.env.NODE_ENV || global.ENV_NAME || global.NODE_ENV || 'default';
        if (this._options.verbose) {
            console.log(`Loading configs (environment: ${chalk.green(this._environmentName)}):`);
        }
        //
        // Checking given directory path.
        if (!this._lastError) {
            let stat: any = null;
            try { stat = fs.statSync(configsDirectory); } catch (e) { }
            if (!stat) {
                this._lastError = `'${configsDirectory}' does not exist.`;
                console.error(this._lastError);
            } else if (!stat.isDirectory()) {
                this._lastError = `'${configsDirectory}' is not a directory.`;
                console.error(this._lastError);
            }
        }

        let files: any[] = [];
        if (!this._lastError) {
            //
            // Basic paths and patterns.
            this._configsDirectory = configsDirectory;
            const configPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const envPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading basic configuration files.
            files = fs.readdirSync(this._configsDirectory)
                .filter(x => x.match(configPattern))
                .map(x => {
                    return {
                        name: x.replace(configPattern, '$1'),
                        path: path.resolve(path.join(this._configsDirectory, x))
                    };
                });
            //
            // Loading evironment specific configuration files.
            const envFiles = fs.readdirSync(this._configsDirectory)
                .filter(x => x.match(envPattern))
                .map(x => {
                    return {
                        name: x.replace(envPattern, '$1'),
                        path: path.resolve(path.join(this._configsDirectory, x))
                    };
                });
            //
            // Merging lists.
            for (let i in files) {
                for (let j in envFiles) {
                    if (files[i].name === envFiles[j].name) {
                        files[i].specific = envFiles[j];
                        break;
                    }
                }
            }
        }

        this._configs = {};
        this._exports = {};
        if (!this._lastError) {
            for (let i in files) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(files[i].name)}'${files[i].specific ? ` (has specific configuration)` : ''}`);
                    }
                    //
                    // Loading basic configuration.
                    this._configs[files[i].name] = require(files[i].path);
                    //
                    // Merging with the environment specific configuration.
                    if (files[i].specific) {
                        this._configs[files[i].name] = Tools.DeepMergeObjects(this._configs[files[i].name], require(files[i].specific.path));
                    }

                    this.loadExports(files[i].name);
                } catch (e) {
                    console.error(`Unable to load config '${files[i].name}'.\n\t${e}`);
                }
            }
        }

        this._valid = !this._lastError;
    }
    protected loadExports(name: string): void {
        const config: any = this._configs[name];

        if (typeof config.$exports !== 'undefined' || typeof config.$pathExports !== 'undefined') {
            this._exports[name] = {};
        }

        if (typeof config.$exports !== 'undefined') {
            this._exports[name] = Tools.DeepMergeObjects(this._exports[name], config.$exports);
        }

        if (typeof config.$pathExports !== 'undefined') {
            for (let k in config.$pathExports) {
                const results: any = jsonpath({
                    path: config.$pathExports[k],
                    json: config
                });

                this._exports[name][k] = null;
                if (results.length == 1) {
                    this._exports[name][k] = results[0];
                } else if (results.length > 1) {
                    this._exports[name][k] = results;
                }
            }
        }
    }
}
