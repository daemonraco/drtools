/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as ajv from 'ajv';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as jsonpath from 'jsonpath-plus';
import * as path from 'path';

import { ConfigsConstants, ConfigsList, ConfigOptions, ConfigSpecsList } from '.';
import { ExpressMiddleware } from '../express';
import { OptionsList, Tools } from '../includes';

declare const global: any;
declare const process: any;

export class ConfigsManager {
    //
    // Protected properties.
    protected _configs: ConfigsList = {};
    protected _directory: string = null;
    protected _environmentName: string = null;
    protected _exports: ConfigsList = {};
    protected _lastError: string = null;
    protected _options: ConfigOptions = null;
    protected _specs: ConfigSpecsList = {};
    protected _specsDirectory: string = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    public constructor(directory: string, options: ConfigOptions = {}) {
        this._directory = directory;
        this._specsDirectory = path.join(directory, 'specs');
        this._options = options;
        this.cleanOptions();

        this.load();
    }
    //
    // Public methods.
    public directory(): string {
        return this._directory;
    }
    public environmentName(): string {
        return this._environmentName;
    }
    public get(name: string): any {
        return typeof this._configs[name] !== 'undefined' ? this._configs[name] : {};
    }
    public getSpecs(name: string): any {
        return typeof this._specs[name] !== 'undefined' ? this._specs[name] : null;
    }
    public itemNames(): string[] {
        return Object.keys(this._configs);
    }
    public lastError(): string {
        return this._lastError;
    }
    public publicItemNames(): string[] {
        return Object.keys(this._exports);
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
    protected load(): void {
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
            try { stat = fs.statSync(this._directory); } catch (e) { }
            if (!stat) {
                this._lastError = `'${this._directory}' does not exist.`;
                console.error(chalk.red(this._lastError));
            } else if (!stat.isDirectory()) {
                this._lastError = `'${this._directory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
            }
        }

        if (!this._lastError) {
            let stat: any = null;
            try { stat = fs.statSync(this._specsDirectory); } catch (e) { }
            if (!stat) {
                this._specsDirectory = null;
            } else if (!stat.isDirectory()) {
                this._lastError = `'${this._specsDirectory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
            }
        }

        let files: any[] = [];
        if (!this._lastError) {
            //
            // Basic patterns.
            const configPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const envPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading basic configuration files.
            files = fs.readdirSync(this._directory)
                .filter(x => x.match(configPattern))
                .map(x => {
                    return {
                        name: x.replace(configPattern, '$1'),
                        path: path.resolve(path.join(this._directory, x))
                    };
                });
            //
            // Loading evironment specific configuration files.
            const envFiles = fs.readdirSync(this._directory)
                .filter(x => x.match(envPattern))
                .map(x => {
                    return {
                        name: x.replace(envPattern, '$1'),
                        path: path.resolve(path.join(this._directory, x))
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
                let valid: boolean = true;

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
                    //
                    // Does it have specs?
                    if (this._specsDirectory && this.loadSpecsOf(files[i].name)) {
                        valid = this.validateSpecsOf(files[i].name);
                    }
                    //
                    // If there were no errors validating the config file, it can
                    // expose exports.
                    if (valid) {
                        this.loadExportsOf(files[i].name);
                    } else {
                        this._configs[files[i].name] = {};
                    }
                } catch (e) {
                    console.error(chalk.red(`Unable to load config '${files[i].name}'.\n\t${e}`));
                }
            }
        }

        this._valid = !this._lastError;
    }
    protected loadExportsOf(name: string): void {
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
    protected loadSpecsOf(name: string): boolean {
        let hasSpecs: boolean = false;

        const specsPath: string = path.join(this._specsDirectory, `${name}.json`);
        let stat: any = null;
        try { stat = fs.statSync(specsPath); } catch (e) { }
        if (!stat) {
            // Nothing not to do.
        } else if (!stat.isFile()) {
            this._lastError = `'${this._directory}' is not a file.`;
            console.error(chalk.red(this._lastError));
        } else {
            hasSpecs = true;
        }

        return hasSpecs;
    }
    protected validateSpecsOf(name: string): boolean {
        let valid: boolean = false;

        const specsPath: string = path.join(this._specsDirectory, `${name}.json`);
        this._specs[name] = null;
        try {
            this._specs[name] = require(specsPath);
        } catch (e) {
            this._lastError = `'${this._directory}' is not valid specification file. ${e}`;
            console.error(chalk.red(this._lastError));
        }
        //
        // Creating a validator.
        try {
            const ajvObj: any = new ajv({
                useDefaults: true
            });
            const validator: any = ajvObj.compile(this._specs[name]);
            if (!validator(this._configs[name])) {
                throw `'\$${validator.errors[0].dataPath}' ${validator.errors[0].message}`;
            } else {
                valid = true;
            }
        } catch (e) {
            console.error(chalk.red(`Config '${name}' is not valid.\n\t${e}`));
        }

        return valid;
    }
}
