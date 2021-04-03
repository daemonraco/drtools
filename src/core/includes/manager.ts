/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk, glob, path } from '../../libraries';

import { ConfigsManager } from '../configs';
import { IAsyncManager, IManagerByKey } from '../drcollector';
import { IItemSpec } from '.';
import { Tools, ToolsCheckPath } from '../includes';

declare const process: any;

export abstract class GenericManager<TOptions> implements IAsyncManager, IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directories: string[] = [];
    protected _itemSpecs: IItemSpec[] = [];
    protected _lastError: string = null;
    protected _loaded: boolean = false;
    protected _options: TOptions = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(directories: string[] | string, options: TOptions = null, configs: ConfigsManager = null) {
        this._configs = configs;
        this._options = options;
        this._directories = Array.isArray(directories) ? directories : [directories];

        this.cleanOptions();
        this.checkDirectories();
        this.loadItemPaths();
    }
    //
    // Public methods.
    public directories(): string[] {
        return this._directories;
    }
    /** @deprecated */
    public directory(): string {
        return this._directories[0];
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
        return (<any>this._options).suffix !== undefined ? (<any>this._options).suffix : '';
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected checkDirectories(): void {
        //
        // Checking given directory path.
        if (!this._lastError) {
            for (const index in this._directories) {
                const check = Tools.CheckDirectory(this._directories[index], process.cwd());
                switch (check.status) {
                    case ToolsCheckPath.Ok:
                        this._directories[index] = check.path;
                        break;
                    case ToolsCheckPath.WrongType:
                        this._lastError = `'${this._directories[index]}' is not a directory.`;
                        console.error(chalk.red(this._lastError));
                        break;
                    default:
                        this._lastError = `'${this._directories[index]}' does not exist.`;
                        console.error(chalk.red(this._lastError));
                        break;
                }

                if (this._lastError) {
                    break;
                }
            }

            this._valid = !this._lastError;
        }
    }
    protected abstract cleanOptions(): void;
    /* istanbul ignore next */
    protected loadItemPaths(): void {
        if (!this._lastError) {
            this._itemSpecs = [];
            //
            // Basic patterns.
            let suffix: string = this.suffix();
            suffix = suffix ? `\\.${suffix}` : '';
            const itemsPattern: RegExp = new RegExp(`^(.*)/(.*)${suffix}\.(json|js|ts)$`);

            for (const directory of this._directories) {
                let paths: string[] = glob.sync(path.join(directory, `*${suffix}.*`), { absolute: true });

                this._itemSpecs = [
                    ...this._itemSpecs,
                    ...paths
                        .filter((x: string) => x.match(itemsPattern))
                        .map((x: string) => ({
                            name: x.replace(itemsPattern, '$2'),
                            path: x,
                        })),
                ];
            }

            this._valid = !this._lastError;
        }
    }
}
