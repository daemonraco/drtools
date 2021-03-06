/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { DRCollector, IAsyncManager, IManagerByKey } from '../drcollector';
import { IToolsCheckPathResult, TAB, Tools, ToolsCheckPath } from '../includes';
import { PluginsConstants, IPluginsOptions, IPluginSpecs, IPluginSpecsList } from '.';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export class PluginsManager implements IAsyncManager, IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager | null = null;
    protected _directories: string[] = [];
    protected _itemSpecs: IPluginSpecsList | null = null;
    protected _lastError: string | null = null;
    protected _loaded: boolean = false;
    protected _options: IPluginsOptions | null = null;
    protected _paths: any[] = [];
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(directory: string | string[], options: IPluginsOptions | null = null, configs: ConfigsManager | null = null) {
        this._directories = Array.isArray(directory) ? directory : [directory];
        this._options = options;
        this._configs = configs;

        this.cleanOptions();
        this.checkDirectories();
        this.loadItemPaths();

        this._valid = !this._lastError;

        DRCollector.registerPluginsManager(this);
    }
    //
    // Public methods.
    public configNameOf(name: string): string {
        return `${this._options?.configsPrefix || PluginsConstants.ConfigsPrefix}${name}`;
    }
    public configOf(name: string): any {
        let results: any = {};

        if (this._configs) {
            results = this._configs.get(this.configNameOf(name));
        }

        return results;
    }
    public configs(): ConfigsManager | null {
        return this._configs;
    }
    /** @deprecated */
    public directory(): string {
        return this._directories[0];
    }
    public directories(): string[] {
        return this._directories;
    }
    public get(code: string): any {
        let results: any = null;

        const codePieces = code.split('::');
        if (codePieces[1] === undefined) {
            codePieces[1] = PluginsConstants.DefaultMethod;
        }

        if (this._itemSpecs && this._itemSpecs[codePieces[0]] !== undefined) {
            const specs: IPluginSpecs = this._itemSpecs[codePieces[0]];

            if (specs.library[codePieces[1]] !== undefined) {
                results = specs.library[codePieces[1]];
            }
        }

        return results;
    }
    public items(): IPluginSpecsList {
        return Tools.DeepCopy(this._itemSpecs);
    }
    public itemNames(): string[] {
        return Object.keys(<IPluginSpecsList>this._itemSpecs);
    }
    public lastError(): string | null {
        return this._lastError;
    }
    public async load(): Promise<boolean> {
        if (!this._loaded) {
            this._loaded = true;

            if (!this._lastError) {
                this._itemSpecs = {};

                if (this._options?.verbose) {
                    console.log(`Loading plugins:`);
                }

                for (const dir of this._paths) {
                    try {
                        if (this._options?.verbose) {
                            console.log(`${TAB}- '${chalk.green(dir.name)}'`);
                        }
                        //
                        // Should it consider a distribution folder?
                        if (this._options?.dist) {
                            const distPath: string = path.join(dir.path, this._options?.distPath || 'dist');
                            let stat: fs.Stats | null = null;
                            try { stat = await fs.stat(distPath); } catch (e) { }
                            if (stat && stat.isDirectory()) {
                                dir.path = distPath;
                            }
                        }

                        (<any>global)[PluginsConstants.GlobalConfigPointer] = this.configOf(dir.name);
                        let library: any = require(path.join(dir.path, 'index'));
                        delete (<any>global)[PluginsConstants.GlobalConfigPointer];

                        if (typeof library !== 'object' || Array.isArray(library)) {
                            const aux = library;
                            library = {};
                            library[`${PluginsConstants.DefaultMethod}`] = aux;
                        }

                        let prom: any = null;
                        switch (typeof library[`${PluginsConstants.InitializationMethod}`]) {
                            case 'function':
                                prom = library[`${PluginsConstants.InitializationMethod}`]();
                                break;
                            case 'object':
                                prom = library[`${PluginsConstants.InitializationMethod}`];
                                break;
                        }
                        if (prom && prom instanceof Promise) {
                            await prom;
                        }

                        this._itemSpecs[dir.name] = { name: dir.name, path: dir.path, library };
                    } catch (err) {
                        console.error(chalk.red(`Unable to load plugin '${dir.name}'.`), err);
                    }
                }
            }

            this._valid = !this._lastError;
        }

        return this.valid();
    }
    public loaded(): boolean {
        return this._loaded;
    }
    public matchesKey(key: string): boolean {
        return this.directory() === key;
    }
    public methodsOf(name: string): string[] {
        return this._itemSpecs && this._itemSpecs[name] !== undefined ? Object.keys(this._itemSpecs[name].library) : [];
    }
    public options(): IPluginsOptions | null {
        return this._options;
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected checkDirectories(): void {
        //
        // Checking given directory paths.
        if (!this._lastError) {
            for (const index in this._directories) {
                const check: IToolsCheckPathResult = Tools.CheckDirectory(this._directories[index], process.cwd());
                switch (check.status) {
                    case ToolsCheckPath.Ok:
                        this._directories[index] = check.path;
                        break;
                    case ToolsCheckPath.WrongType:
                        this._lastError = `'${this._directories[index]}' is not a directory.`;
                        console.error(chalk.red(this._lastError));
                    default:
                        this._lastError = `'${this._directories[index]}' does not exist.`;
                        console.error(chalk.red(this._lastError));
                }

                if (this._lastError) {
                    break;
                }
            }
        }
    }
    /* istanbul ignore next */
    protected cleanOptions(): void {
        let defaultOptions: IPluginsOptions = {
            configsPrefix: PluginsConstants.ConfigsPrefix,
            dist: false,
            distPath: 'dist',
            verbose: true,
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    /* istanbul ignore next */
    protected loadItemPaths(): void {
        if (!this._lastError) {
            this._paths = [];

            for (const directory of this._directories) {
                let dirs = fs.readdirSync(directory).map((x: any) => ({
                    name: x,
                    path: Tools.FullPath(path.join(directory, x))
                })).filter((x: any) => {
                    const check = Tools.CheckDirectory(x.path);
                    return check.status === ToolsCheckPath.Ok;
                });

                for (const dir of dirs) {
                    this._paths.push(dir);
                }
            }
        }
    }
}