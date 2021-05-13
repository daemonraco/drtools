/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, IItemSpec, IToolsCheckPathResult, TAB, Tools, ToolsCheckPath } from '../includes';
import { ConfigsConstants, IConfigItem, IConfigOptions } from '.';
import { DRCollector, IManagerByKey } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { IConfigSpecItem } from './types';
import { JSONPath } from 'jsonpath-plus';
import { KoaMiddleware } from '../koa';
import { StatusCodes } from 'http-status-codes';
import * as fs from 'fs-extra';
import * as path from 'path';
import Ajv from 'ajv';
import chalk from 'chalk';
import md5 from 'md5';

enum PublishExportsTypes {
    Express = 'express',
    Koa = 'koa',
};

const ENV_PATTERN: RegExp = /^ENV:([^:]+)(:|)(.*)$/;

export class ConfigsManager implements IManagerByKey {
    //
    // Protected properties.
    protected _directories: string[] = [];
    protected _environmentName: string = '';
    protected _exports: BasicDictionary = {};
    protected _items: BasicDictionary<IConfigItem> = {};
    protected _key: string = '';
    protected _lastError: string | null = null;
    protected _options: IConfigOptions = {};
    protected _publicUri: string = '';
    protected _specs: BasicDictionary<IConfigSpecItem> = {};
    protected _specsDirectories: string[] = [];
    protected _valid: boolean = false;
    //
    // Constructor.
    public constructor(directory: string | string[], options: IConfigOptions = {}) {
        this._options = options;
        this.cleanOptions();

        this._directories = Array.isArray(directory) ? directory : [directory];
        this._specsDirectories = this._options.specs
            ? Array.isArray(this._options.specs) ? this._options.specs : [this._options.specs]
            : [];

        this.load();

        DRCollector.registerConfigsManager(this);
    }
    //
    // Public methods.
    public directories(): string[] {
        return this._directories;
    }
    public environmentName(): string {
        return this._environmentName;
    }
    public get(name: string): any {
        return this._items[name] !== undefined ? this._items[name].data : {};
    }
    public getSpecs(name: string): any {
        return this._specs[name] !== undefined ? this._specs[name].specs : null;
    }
    public items(): BasicDictionary<IConfigItem> {
        return this._items;
    }
    public itemNames(): string[] {
        return Object.keys(this._items);
    }
    public key(): string {
        return this._key;
    }
    public lastError(): string | null {
        return this._lastError;
    }
    public matchesKey(key: string): boolean {
        return this._key === key;
    }
    public options(): IConfigOptions {
        return Tools.DeepCopy(this._options);
    }
    public publicItemNames(): string[] {
        return Object.keys(this._exports);
    }
    public publishExports(uri: string = ConfigsConstants.PublishUri): ExpressMiddleware {
        return <ExpressMiddleware>this.genericPublishExports(PublishExportsTypes.Express, uri);
    }
    public publishExportsForKoa(uri: string = ConfigsConstants.PublishUri): KoaMiddleware {
        return <KoaMiddleware>this.genericPublishExports(PublishExportsTypes.Koa, uri);
    }
    public publicUri(): string {
        return this._publicUri;
    }
    public specs(): BasicDictionary<IConfigSpecItem> {
        return this._specs;
    }
    public specsDirectories(): string[] {
        return this._specsDirectories;
    }
    public specsSuffix(): string {
        return this._options.specsSuffix || ConfigsConstants.SpecsSuffix;
    }
    public suffix(): string {
        return this._options.suffix || ConfigsConstants.Suffix;
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected cleanOptions(): void {
        let defaultOptions: IConfigOptions = {
            environmentVariables: false,
            key: undefined,
            specs: undefined,
            specsSuffix: ConfigsConstants.SpecsSuffix,
            suffix: ConfigsConstants.Suffix,
            verbose: true,
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    /* istanbul ignore next */
    protected expandEnvVariablesIn(data: any): any {
        switch (typeof data) {
            case 'string':
                //
                // Does it require expanding?
                const match: RegExpMatchArray | null = data.match(ENV_PATTERN);
                if (match) {
                    //
                    // Is it a valid variable or should it use a default value?
                    if (process.env[match[1]] !== undefined) {
                        data = process.env[match[1]];
                    } else {
                        data = match[3];
                    }
                }
                break;
            case 'object':
                if (Array.isArray(data)) {
                    for (const idx in data) {
                        data[idx] = this.expandEnvVariablesIn(data[idx]);
                    }
                } else if (data) {
                    for (const key of Object.keys(data)) {
                        data[key] = this.expandEnvVariablesIn(data[key]);
                    }
                }
                break;
        }

        return data;
    }
    /* istanbul ignore next */
    protected genericPublishExports(type: PublishExportsTypes, uri: string = ConfigsConstants.PublishUri): ExpressMiddleware | KoaMiddleware {
        //
        // Cleaning URI @{
        this._publicUri = `/${uri}/`;
        [
            ['//', '/']
        ].forEach((pair: any) => {
            while (this._publicUri.indexOf(pair[0]) > -1) {
                this._publicUri = this._publicUri.replace(pair[0], pair[1]);
            }
        });
        this._publicUri = this._publicUri.substr(0, this._publicUri.length - 1);
        const uriForPattern: string = this._publicUri.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}

        const pattern: RegExp = new RegExp(`^${uriForPattern}([\\/]?)(.*)$`);

        let middlewareResult: ExpressMiddleware | KoaMiddleware | null = null;

        switch (type) {
            case PublishExportsTypes.Express:
                middlewareResult = (req: any, res: any, next: () => void) => {
                    let responded: boolean = false;

                    if (req.originalUrl.match(pattern)) {
                        const name: string = req.originalUrl.replace(pattern, '$2');
                        if (name) {
                            if (this._exports[name] !== undefined) {
                                res.json(this._exports[name]);
                            } else {
                                res.status(StatusCodes.NOT_FOUND).json({
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
                break;
            case PublishExportsTypes.Koa:
                middlewareResult = async (ctx: any, next: () => void): Promise<any> => {
                    let responded: boolean = false;

                    if (ctx.originalUrl.match(pattern)) {
                        const name: string = ctx.originalUrl.replace(pattern, '$2');
                        if (name) {
                            if (this._exports[name] !== undefined) {
                                ctx.body = this._exports[name];
                            } else {
                                ctx.throw(StatusCodes.NOT_FOUND, {
                                    error: true,
                                    message: `Unknown exported configuration '${name}'.`
                                });
                            }
                        } else {
                            ctx.body = {
                                configs: Object.keys(this._exports),
                            };
                        }

                        responded = true;
                    }

                    if (!responded) {
                        await next();
                    }
                };
                break;
        }

        return middlewareResult;
    }
    /* istanbul ignore next */
    protected load(): void {
        this._lastError = null;
        //
        // Generating a unique key for this manager.
        this._key = this._options.key ? this._options.key : md5(JSON.stringify(this._directories));
        //
        // Loading environment names.
        this._environmentName = process.env.NODE_ENV || process.env.ENV_NAME || (<any>global).NODE_ENV || (<any>global).ENV_NAME || 'default';
        //
        // Checking given directory path.
        for (let i = 0; i < this._directories.length; i++) {
            if (this._lastError) {
                break;
            }

            const check = Tools.CheckDirectory(this._directories[i], process.cwd());
            switch (check.status) {
                case ToolsCheckPath.Ok:
                    this._directories[i] = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directories[i]}' is not a directory.`;
                    console.error(chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._directories[i]}' does not exist.`;
                    console.error(chalk.red(this._lastError));
                    break;
            }
        }
        //
        // Checking specs directory.
        for (let i = 0; i < this._specsDirectories.length; i++) {
            if (this._lastError) {
                break;
            }

            const check = Tools.CheckDirectory(this._specsDirectories[i], process.cwd());
            switch (check.status) {
                case ToolsCheckPath.Ok:
                    this._specsDirectories[i] = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    this._lastError = `'${this._specsDirectories[i]}' is not a directory.`;
                    console.error(chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._specsDirectories[i]}' does not exist.`;
                    console.error(chalk.red(this._lastError));
                    break;
            }
        }

        if (!this._lastError) {
            //
            // Basic patterns.
            const configPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const configSpecPattern: RegExp = new RegExp(`^(.*)\\.${this._options.specsSuffix}\\.(json|js)$`);
            const envPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading specs files.
            this._specs = {};
            for (const directory of this._specsDirectories) {
                for (const p of fs.readdirSync(directory).filter((x: string) => x.match(configSpecPattern))) {
                    const name: string = p.replace(configSpecPattern, '$1');
                    this._specs[name] = {
                        name,
                        path: path.resolve(path.join(directory, p)),
                        valid: false,
                    };
                }
            }
            //
            // Loading basic configuration files.
            this._items = {};
            for (const directory of this._directories) {
                for (const p of fs.readdirSync(directory).filter((x: string) => x.match(configPattern))) {
                    const name: string = p.replace(configPattern, '$1');
                    this._items[name] = {
                        name,
                        path: path.resolve(path.join(directory, p)),
                        data: null,
                        valid: false,
                    };
                }
            }
            //
            // Loading environment specific configuration files.
            for (const directory of this._directories) {
                for (const x of fs.readdirSync(directory).filter((x: string) => x.match(envPattern))) {
                    const name: string = x.replace(envPattern, '$1');
                    if (this._items[name] !== undefined) {
                        this._items[name].specific = {
                            name,
                            path: path.resolve(path.join(directory, x)),
                        };
                    }
                }
            }
        }

        this._exports = {};
        if (!this._lastError) {
            //
            // Loading specs.
            if (this._options.verbose) {
                console.log(`Loading config specs:`);
            }
            for (const name of Object.keys(this._specs)) {
                this._specs[name].valid = true;

                try {
                    if (this._options.verbose) {
                        console.log(`${TAB}- '${chalk.green(name)}'`);
                    }
                    //
                    // Loading basic configuration.
                    try {
                        this._specs[name].specs = require(this._specs[name].path);
                    } catch (e) {
                        this._lastError = `'${this._specs[name].path}' is not valid specification file. ${e}`;
                        console.error(chalk.red(this._lastError));
                        this._specs[name].valid = false;
                    }
                    //
                    // Creating a validator.
                    try {
                        const ajvObj: any = new Ajv({
                            strict: false,
                            useDefaults: true,
                        });
                        this._specs[name].validator = ajvObj.compile(this._specs[name].specs);
                    } catch (e) {
                        this._lastError = `Unable to compile '${this._specs[name].path}'. ${e}`;
                        console.error(chalk.red(this._lastError));
                        this._specs[name].valid = false;
                    }
                } catch (err) {
                    console.error(chalk.red(`Unable to load config '${name}'.`), err);
                }
            }
            //
            // Loading configurations.
            if (this._options.verbose) {
                console.log(`Loading configs (environment: ${chalk.green(this._environmentName)}):`);
            }
            for (const itemKey of Object.keys(this._items)) {
                let name: string = this._items[itemKey].name;

                try {
                    if (this._options.verbose) {
                        console.log(`${TAB}- '${chalk.green(name)}'${this._items[itemKey].specific ? ` (has specific configuration)` : ''}`);
                    }
                    //
                    // Loading basic configuration.
                    this._items[itemKey].data = require(this._items[itemKey].path);
                    //
                    // Merging with the environment specific configuration.
                    if (this._items[itemKey].specific) {
                        this._items[itemKey].data = Tools.DeepMergeObjects(this._items[itemKey].data, require((<IItemSpec>this._items[itemKey].specific).path));
                    }
                    //
                    // If there were no errors validating the config file, it can
                    // expose exports.
                    if (this.validateSpecsOf(name)) {
                        if (this._options.environmentVariables) {
                            this._items[itemKey].data = this.expandEnvVariablesIn(this._items[itemKey].data);
                        }
                        this._items[itemKey].public = this.loadExportsOf(name);
                    } else {
                        this._items[itemKey].valid = false;
                    }
                } catch (err) {
                    console.error(chalk.red(`Unable to load config '${name}'.`), err);
                }
            }
        }

        this._valid = !this._lastError;
    }
    /* istanbul ignore next */
    protected loadExportsOf(name: string): boolean {
        let hasExports: boolean = false;

        const config: any = this._items[name].data;

        if (config.$exports !== undefined || config.$pathExports !== undefined) {
            this._exports[name] = {};
        }

        if (config.$exports !== undefined) {
            this._exports[name] = Tools.DeepMergeObjects(this._exports[name], config.$exports);
            hasExports = true;
        }

        if (config.$pathExports !== undefined) {
            for (let k in config.$pathExports) {
                const results: any = JSONPath({
                    path: config.$pathExports[k],
                    json: config
                });

                this._exports[name][k] = null;
                if (results.length == 1) {
                    this._exports[name][k] = results[0];
                } else if (results.length > 1) {
                    this._exports[name][k] = results;
                }

                hasExports = true;
            }
        }

        return hasExports;
    }
    /* istanbul ignore next */
    protected loadSpecsOf(name: string): string | null {
        let specsPath: string | null = null;

        for (const specsDirectory of this._specsDirectories) {
            const tmpSpecsPath: string = path.join(specsDirectory, `${name}.json`);
            const check: IToolsCheckPathResult = Tools.CheckFile(tmpSpecsPath);

            switch (check.status) {
                case ToolsCheckPath.Ok:
                    specsPath = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    this._lastError = `'${tmpSpecsPath}' is not a file.`;
                    console.error(chalk.red(this._lastError));
                    break;
                default:
                    specsPath = null;
                    break;
            }
        }

        return specsPath;
    }
    /* istanbul ignore next */
    protected validateSpecsOf(name: string): boolean {
        let valid: boolean = false;

        if (this._specs[name] && this._specs[name].valid) {
            try {
                if (!this._specs[name].validator(this._items[name].data)) {
                    const error: any = this._specs[name].validator.errors[0];
                    throw `'${error.instancePath || '/'}': ${error.message}`;
                } else {
                    valid = true;
                }
            } catch (e) {
                console.error(chalk.red(`Config '${name}' is not valid.\n${TAB}${e}`));
            }
        } else {
            valid = true;
        }

        return valid;
    }
}
