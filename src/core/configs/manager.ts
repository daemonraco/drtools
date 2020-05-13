/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

const jsonpath = require('jsonpath-plus');
import { ajv, chalk, fs, httpStatusCodes, path } from '../../libraries';

import { ConfigItemSpec, ConfigsConstants, ConfigsList, IConfigOptions, ConfigSpecsList } from '.';
import { DRCollector, IManagerByKey } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { IItemSpec, Tools, ToolsCheckPath } from '../includes';
import { KoaMiddleware } from '../koa';

enum PublishExportsTypes {
    Express = 'express',
    Koa = 'koa',
};

declare const global: any;
declare const process: any;

const ENV_PATTERN: RegExp = /^ENV:(.+)$/;

export class ConfigsManager implements IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsList = {};
    protected _directory: string = null;
    protected _environmentName: string = null;
    protected _items: ConfigItemSpec[] = [];
    protected _exports: ConfigsList = {};
    protected _lastError: string = null;
    protected _options: IConfigOptions = null;
    protected _specs: ConfigSpecsList = {};
    protected _specsDirectory: string = null;
    protected _publicUri: string = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    public constructor(directory: string, options: IConfigOptions = {}) {
        this._directory = directory;
        this._specsDirectory = path.join(directory, ConfigsConstants.SpecsDirectory);
        this._options = options;
        this.cleanOptions();

        this.load();

        DRCollector.registerConfigsManager(this);
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
        return this._configs[name] !== undefined ? this._configs[name] : {};
    }
    public getSpecs(name: string): any {
        return this._specs[name] !== undefined ? this._specs[name] : null;
    }
    public items(): ConfigItemSpec[] {
        return this._items;
    }
    public itemNames(): string[] {
        return this._items.map((i: ConfigItemSpec) => i.name);
    }
    public lastError(): string {
        return this._lastError;
    }
    public matchesKey(key: string): boolean {
        return this.directory() === key;
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
    public specsDirectory(): string {
        return this._specsDirectory;
    }
    public suffix(): string {
        return this._options.suffix;
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: IConfigOptions = {
            environmentVariable: false,
            suffix: ConfigsConstants.Suffix,
            verbose: true,
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected expandEnvVariablesIn(data: any): any {
        switch (typeof data) {
            case 'string':
                const match: RegExpMatchArray | null = data.match(ENV_PATTERN);
                if (match) {
                    data = process.env[match[1]];
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

        let middlewareResult: ExpressMiddleware | KoaMiddleware = null;

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
                                res.status(httpStatusCodes.NOT_FOUND).json({
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
                                ctx.throw(httpStatusCodes.NOT_FOUND, {
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
    protected load(): void {
        this._lastError = null;
        //
        // Loading environment names.
        this._environmentName = process.env.NODE_ENV || process.env.ENV_NAME || global.NODE_ENV || global.ENV_NAME || 'default';
        if (this._options.verbose) {
            console.log(`Loading configs (environment: ${chalk.green(this._environmentName)}):`);
        }
        //
        // Checking given directory path.
        if (!this._lastError) {
            const check = Tools.CheckDirectory(this._directory, process.cwd());
            switch (check.status) {
                case ToolsCheckPath.Ok:
                    this._directory = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directory}' is not a directory.`;
                    console.error(chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._directory}' does not exist.`;
                    console.error(chalk.red(this._lastError));
                    break;
            }
        }
        //
        // Checking specs directory.
        if (!this._lastError) {
            const check = Tools.CheckDirectory(this._specsDirectory, process.cwd());
            switch (check.status) {
                case ToolsCheckPath.Ok:
                    this._specsDirectory = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    this._lastError = `'${this._specsDirectory}' is not a directory.`;
                    console.error(chalk.red(this._lastError));
                    break;
                default:
                    this._specsDirectory = null;
                    break;
            }
        }

        if (!this._lastError) {
            //
            // Basic patterns.
            const configPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            const envPattern: RegExp = new RegExp(`^(.*)\\.${this._options.suffix}\\.${this._environmentName}\\.(json|js)$`);
            //
            // Loading basic configuration files.
            this._items = fs.readdirSync(this._directory)
                .filter((x: string) => x.match(configPattern))
                .map((x: string) => ({
                    name: x.replace(configPattern, '$1'),
                    path: path.resolve(path.join(this._directory, x))
                }));
            //
            // Loading evironment specific configuration files.
            const envFiles: IItemSpec[] = fs.readdirSync(this._directory)
                .filter((x: string) => x.match(envPattern))
                .map((x: string) => ({
                    name: x.replace(envPattern, '$1'),
                    path: path.resolve(path.join(this._directory, x))
                }));
            //
            // Merging lists.
            for (let i in this._items) {
                for (let j in envFiles) {
                    if (this._items[i].name === envFiles[j].name) {
                        this._items[i].specific = envFiles[j];
                        break;
                    }
                }
            }
        }

        this._configs = {};
        this._exports = {};
        if (!this._lastError) {
            for (const item of this._items) {
                let valid: boolean = true;
                let name: string = item.name;

                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(name)}'${item.specific ? ` (has specific configuration)` : ''}`);
                    }
                    //
                    // Loading basic configuration.
                    this._configs[name] = require(item.path);
                    //
                    // Merging with the environment specific configuration.
                    if (item.specific) {
                        this._configs[name] = Tools.DeepMergeObjects(this._configs[name], require(item.specific.path));
                    }
                    //
                    // Does it have specs?
                    this._configs[name].specsPath = null;
                    if (this._specsDirectory) {
                        this._configs[name].specsPath = this.loadSpecsOf(name);
                        if (this._configs[name].specsPath !== null) {
                            valid = this.validateSpecsOf(name, this._configs[name].specsPath);
                        }
                    }
                    //
                    // If there were no errors validating the config file, it can
                    // expose exports.
                    if (valid) {
                        if (this._options.environmentVariable) {
                            this._configs[name] = this.expandEnvVariablesIn(this._configs[name]);
                        }
                        this._configs[name].public = this.loadExportsOf(name);
                    } else {
                        this._configs[name] = {};
                    }
                } catch (err) {
                    console.error(chalk.red(`Unable to load config '${name}'.`), err);
                }
            }
        }

        this._valid = !this._lastError;
    }
    protected loadExportsOf(name: string): boolean {
        let hasExports: boolean = false;

        const config: any = this._configs[name];

        if (config.$exports !== undefined || config.$pathExports !== undefined) {
            this._exports[name] = {};
        }

        if (config.$exports !== undefined) {
            this._exports[name] = Tools.DeepMergeObjects(this._exports[name], config.$exports);
            hasExports = true;
        }

        if (config.$pathExports !== undefined) {
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

                hasExports = true;
            }
        }

        return hasExports;
    }
    protected loadSpecsOf(name: string): string {
        let specsPath: string = path.join(this._specsDirectory, `${name}.json`);

        const check = Tools.CheckFile(specsPath);
        switch (check.status) {
            case ToolsCheckPath.Ok:
                specsPath = check.path;
                break;
            case ToolsCheckPath.WrongType:
                this._lastError = `'${specsPath}' is not a file.`;
                console.error(chalk.red(this._lastError));
                break;
            default:
                specsPath = null;
                break;
        }

        return specsPath;
    }
    protected validateSpecsOf(name: string, specsPath: string): boolean {
        let valid: boolean = false;

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
