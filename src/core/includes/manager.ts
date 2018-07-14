/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk, fs, path } from '../../libraries';

import { ConfigsManager } from '../configs';
import { IAsyncManager, IManagerByKey } from '../drcollector';
import { IItemSpec } from '.';
import { Tools } from '../includes';

declare const global: any;

export abstract class GenericManager<TOptions> implements IAsyncManager, IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directory: string = null;
    protected _itemSpecs: IItemSpec[] = [];
    protected _lastError: string = null;
    protected _loaded: boolean = false;
    protected _options: TOptions = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(directory: string, options: TOptions = null, configs: ConfigsManager = null) {
        this._configs = configs;
        this._options = options;
        this._directory = directory;

        this.cleanOptions();
        this.checkDirectory();
        this.loadItemPaths();
    }
    //
    // Public methods.
    public directory(): string {
        return this._directory;
    }
    public items(): IItemSpec[] {
        return Tools.DeepCopy(this._itemSpecs);
    }
    public itemNames(): string[] {
        return this._itemSpecs.map(i => i.name);
    }
    public lastError(): string {
        return this._lastError;
    }
    public abstract load(): Promise<boolean>;
    public loaded(): boolean {
        return this._loaded;
    }
    public matchesKey(key: string): boolean {
        return this.directory() === key;
    }
    public suffix(): string {
        return typeof (<any>this._options).suffix !== 'undefined' ? (<any>this._options).suffix : '';
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected checkDirectory(): void {
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
    }
    protected abstract cleanOptions(): void;
    protected loadItemPaths(): void {
        if (!this._lastError) {
            this._itemSpecs = [];
            //
            // Basic patterns.
            let suffix: string = this.suffix();
            suffix = suffix ? `\\.${suffix}` : '';
            const itemsPattern: RegExp = new RegExp(`^(.*)${suffix}\\.(json|js)$`);

            this._itemSpecs = fs.readdirSync(this._directory)
                .filter(x => x.match(itemsPattern))
                .map(x => {
                    return {
                        name: x.replace(itemsPattern, '$1'),
                        path: Tools.FullPath(path.join(this._directory, x))
                    };
                });
        }
    }
}
