/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk, fs, path } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector, IAsyncManager, IManagerByKey } from '../drcollector';
import { IToolsCheckPathResult, Tools, ToolsCheckPath } from '../includes';
import { PluginsConstants, IPluginsOptions, IPluginSpecs, IPluginSpecsList } from '.';

declare const global: any;
declare const process: any;

export class PluginsManager implements IAsyncManager, IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directory: string = null;
    protected _itemSpecs: IPluginSpecsList = null;
    protected _lastError: string = null;
    protected _loaded: boolean = false;
    protected _options: IPluginsOptions = null;
    protected _paths: any[] = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(directory: string, options: IPluginsOptions = null, configs: ConfigsManager = null) {
        this._directory = directory;
        this._options = options;
        this._configs = configs;

        this.cleanOptions();
        this.checkDirectory();
        this.loadItemPaths();

        this._valid = !this._lastError;

        DRCollector.registerPluginsManager(this);
    }
    //
    // Public methods.
    public configNameOf(name: string): string {
        return `${PluginsConstants.ConfigsPrefix}${name}`;
    }
    public configOf(name: string): any {
        let results: any = {};

        if (this._configs) {
            results = this._configs.get(this.configNameOf(name));
        }

        return results;
    }
    public configs(): ConfigsManager {
        return this._configs;
    }
    public directory(): string {
        return this._directory;
    }
    public get(code: string): any {
        let results: any = null;

        const codePieces = code.split('::');
        if (typeof codePieces[1] === 'undefined') {
            codePieces[1] = PluginsConstants.DefaultMethod;
        }

        if (typeof this._itemSpecs[codePieces[0]] !== 'undefined') {
            const specs: IPluginSpecs = this._itemSpecs[codePieces[0]];

            if (typeof specs.library[codePieces[1]] !== 'undefined') {
                results = specs.library[codePieces[1]];
            }
        }

        return results;
    }
    public items(): IPluginSpecsList {
        return Tools.DeepCopy(this._itemSpecs);
    }
    public itemNames(): string[] {
        return Object.keys(this._itemSpecs);
    }
    public lastError(): string {
        return this._lastError;
    }
    public async load(): Promise<boolean> {
        if (!this._loaded) {
            this._loaded = true;

            if (!this._lastError) {
                this._itemSpecs = {};

                if (this._options.verbose) {
                    console.log(`Loading plugins:`);
                }

                for (const dir of this._paths) {
                    try {
                        if (this._options.verbose) {
                            console.log(`\t- '${chalk.green(dir.name)}'`);
                        }

                        global[PluginsConstants.GlobalConfigPointer] = this.configOf(dir.name);
                        let library: any = require(path.join(dir.path, 'index.js'));
                        delete global[PluginsConstants.GlobalConfigPointer];

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
                    } catch (e) {
                        console.error(chalk.red(`Unable to load plugin '${dir.name}'. ${e}`));
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
        return typeof this._itemSpecs[name] !== 'undefined' ? Object.keys(this._itemSpecs[name].library) : [];
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected checkDirectory(): void {
        //
        // Checking given directory paths.
        if (!this._lastError) {
            const check: IToolsCheckPathResult = Tools.CheckDirectory(this._directory, process.cwd());
            switch (check.status) {
                case ToolsCheckPath.Ok:
                    this._directory = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directory}' is not a directory.`;
                    console.error(chalk.red(this._lastError));
                default:
                    this._lastError = `'${this._directory}' does not exist.`;
                    console.error(chalk.red(this._lastError));
            }
        }
    }
    protected cleanOptions(): void {
        let defaultOptions: IPluginsOptions = {
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected loadItemPaths(): void {
        if (!this._lastError) {
            this._paths = [];

            let dirs = fs.readdirSync(this._directory)
                .map(x => {
                    return {
                        name: x,
                        path: Tools.FullPath(path.join(this._directory, x))
                    };
                })
                .filter(x => {
                    let stat = null;
                    try { stat = fs.statSync(x.path); } catch (e) { }
                    return stat && stat.isDirectory();
                });

            for (const dir of dirs) {
                this._paths.push(dir);
            }
        }
    }
}