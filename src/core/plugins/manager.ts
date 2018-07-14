/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk, fs, path } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector, IManagerByKey } from '../drcollector';
import { Tools } from '../includes';
import { PluginsConstants, IPluginsOptions, IPluginSpecs, IPluginSpecsList } from '.';

declare const global: any;

export class PluginsManager implements IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directories: string[] = [];
    protected _itemSpecs: IPluginSpecsList = null;
    protected _lastError: string = null;
    protected _options: IPluginsOptions = null;
    protected _paths: any[] = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(directories: string | string[], options: IPluginsOptions = null, configs: ConfigsManager = null) {
        if (!Array.isArray(directories)) {
            directories = [directories];
        }
        this._directories = directories;
        this._options = options;
        this._configs = configs;

        this.cleanOptions();
        this.checkDirectories();
        this.loadItemPaths();
        this.load();

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
    public directories(): string[] {
        return this._directories;
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
    public matchesKey(key: string): boolean {
        return this.directories().indexOf(key) > -1;
    }
    public methodsOf(name: string): string[] {
        return typeof this._itemSpecs[name] !== 'undefined' ? Object.keys(this._itemSpecs[name].library) : [];
    }
    public pluginConfig(plgName: string): any {
        let out: any = null;

        return out;
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected checkDirectories(): void {
        //
        // Checking given directory paths.
        if (!this._lastError) {
            const cleanDirectories: string[] = [];

            for (let dir of this._directories) {
                dir = Tools.FullPath(dir);

                let stat: any = null;
                try { stat = fs.statSync(dir); } catch (e) { }
                if (!stat) {
                    this._lastError = `'${dir}' does not exist.`;
                    console.error(chalk.red(this._lastError));
                    break;
                } else if (!stat.isDirectory()) {
                    this._lastError = `'${dir}' is not a directory.`;
                    console.error(chalk.red(this._lastError));
                    break;
                }

                cleanDirectories.push(dir);
            }

            this._directories = cleanDirectories;
        }
    }
    protected cleanOptions(): void {
        let defaultOptions: IPluginsOptions = {
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected load() {
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

                    this._itemSpecs[dir.name] = { name: dir.name, path: dir.path, library };
                } catch (e) {
                    console.error(chalk.red(`Unable to load plugin '${dir.name}'. ${e}`));
                }
            }
        }
    }
    protected loadItemPaths(): void {
        if (!this._lastError) {
            this._paths = [];

            for (const dir of this._directories) {
                let dirs = fs.readdirSync(dir)
                    .map(x => {
                        return {
                            name: x,
                            path: Tools.FullPath(path.join(dir, x))
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
}