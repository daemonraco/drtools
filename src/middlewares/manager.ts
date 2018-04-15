/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';

import { ConfigsManager } from '../configs';
import { GenericManager, Tools } from '../includes';
import { MiddlewaresConstants, MiddlewareOptions } from '.';

declare const global: any;

export class MiddlewaresManager extends GenericManager<MiddlewareOptions>  {
    //
    // Protected properties.

    //
    // Constructor.
    constructor(app: any, directory: string, options: MiddlewareOptions = null, configs: ConfigsManager = null) {
        super(directory, options, configs);
        this.loadAndAttach(app);
        this._valid = !this._lastError;
    }
    //
    // Public methods.

    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: MiddlewareOptions = {
            suffix: MiddlewaresConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected load(): void {
        // Nothing to do here.
    }
    protected loadAndAttach(app: any): void {
        if (this._options.verbose) {
            console.log(`Loading middlewares:`);
        }

        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }

                    global.configs = this._configs;
                    app.use(require(this._itemSpecs[i].path));
                    delete global.configs;
                } catch (e) {
                    console.error(chalk.red(`Unable to load middleware '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
