/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, Tools } from '../includes';
import { LoadersConstants, ILoaderOptions } from '.';
import chalk from 'chalk';

export class LoadersManager extends GenericManager<ILoaderOptions> {
    //
    // Constructor.
    constructor(directory: string, options: ILoaderOptions | null = null, configs: ConfigsManager | null = null) {
        super(directory, options, configs);
        this._valid = !this._lastError;

        DRCollector.registerLoadersManager(this);
    }
    //
    // Public methods.
    public async load(): Promise<boolean> {
        if (!this._loaded) {
            this._loaded = true;

            if (this._options?.verbose) {
                console.log(`Loading loaders:`);
            }

            if (!this._lastError && this._itemSpecs.length > 0) {
                for (let item of this._itemSpecs) {
                    try {
                        if (this._options?.verbose) {
                            console.log(`\t- '${chalk.green(item.name)}'`);
                        }

                        (<any>global)[LoadersConstants.GlobalConfigsPointer] = this._configs;

                        const lib: any = require(item.path);
                        let prom: any = null
                        if (typeof lib === 'function') {
                            prom = lib();
                        } else if (typeof lib === 'object') {
                            prom = lib;
                        }

                        if (prom && prom instanceof Promise) {
                            await prom;
                        }

                        delete (<any>global)[LoadersConstants.GlobalConfigsPointer];
                    } catch (err) {
                        console.error(chalk.red(`Unable to load loader '${item.name}'.`), err);
                    }
                }
            }

            this._valid = !this._lastError;
        }

        return this.valid();
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected cleanOptions(): void {
        let defaultOptions: ILoaderOptions = {
            suffix: LoadersConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
}
