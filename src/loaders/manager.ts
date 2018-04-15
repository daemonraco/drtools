/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';

import { ConfigsManager } from '../configs';
import { GenericManager, Tools } from '../includes';
import { LoadersConstants, LoaderOptions } from '.';

declare const global: any;

export class LoadersManager extends GenericManager<LoaderOptions> {
    //
    // Protected properties.

    //
    // Constructor.

    //
    // Public methods.

    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: LoaderOptions = {
            suffix: LoadersConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected load() {
        if (this._options.verbose) {
            console.log(`Loading loaders:`);
        }


        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }

                    global.configs = this._configs;
                    require(this._itemSpecs[i].path);
                    delete global.configs;
                } catch (e) {
                    console.error(chalk.red(`Unable to load loader '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
