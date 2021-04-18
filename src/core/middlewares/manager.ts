/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, Tools } from '../includes';
import { IMiddlewareOptions, MiddlewaresConstants } from '.';
import chalk from 'chalk';

export class MiddlewaresManager extends GenericManager<IMiddlewareOptions> {
    //
    // Protected properties.
    protected _app: any = null;
    //
    // Constructor.
    constructor(app: any, directory: string, options: IMiddlewareOptions | null = null, configs: ConfigsManager | null = null) {
        super(directory, options, configs);
        this._app = app;
        this._valid = !this._lastError;

        DRCollector.registerMiddlewaresManager(this);
    }
    //
    // Public methods.
    public async load(): Promise<boolean> {
        if (!this._loaded) {
            this._loaded = true;

            this.loadAndAttach();
            this._valid = !this._lastError;
        }

        return this.valid();
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected cleanOptions(): void {
        let defaultOptions: IMiddlewareOptions = {
            suffix: MiddlewaresConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    /* istanbul ignore next */
    protected loadAndAttach(): void {
        if (this._options?.verbose) {
            console.log(`Loading middlewares:`);
        }

        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let item of this._itemSpecs) {
                try {
                    if (this._options?.verbose) {
                        console.log(`\t- '${chalk.green(item.name)}'`);
                    }

                    (<any>global)[MiddlewaresConstants.GlobalConfigPointer] = this._configs;
                    this._app.use(require(item.path));
                    delete (<any>global)[MiddlewaresConstants.GlobalConfigPointer];
                } catch (err) {
                    console.error(chalk.red(`Unable to load middleware '${item.name}'.`), err);
                }
            }
        }
    }
}
