/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { ItemSpec } from '.';
import { Tools } from '../includes';

declare const global: any;

export abstract class GenericManager<TOptions> {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _directory: string = null;
    protected _itemSpecs: ItemSpec[] = [];
    protected _lastError: string = null;
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
    public items(): ItemSpec[] {
        return Tools.DeepCopy(this._itemSpecs);
    }
    public itemNames(): string[] {
        return this._itemSpecs.map(i => i.name);
    }
    public lastError(): string {
        return this._lastError;
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
    protected abstract load(): void;
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
                        path: path.join(this._directory, x)
                    };
                });
        }
    }
}
