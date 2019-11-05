/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, Tools } from '../includes';
import { RoutesConstants, IRouteOptions } from '.';

declare const Promise: any;
declare const global: any;
declare const require: Function;

export class RoutesManager extends GenericManager<IRouteOptions> {
    //
    // Protected properties.
    protected _app: any = null;
    protected _isKoa: boolean = false;
    protected _routes: any[] = [];
    //
    // Constructor.
    constructor(app: any, directories: string[] | string, options: IRouteOptions = {}, configs: ConfigsManager) {
        super(directories, options, configs);
        this._app = app;
        this._isKoa = Tools.IsKoa(this._app);
        this._valid = !this._lastError;

        DRCollector.registerRoutesManager(this);
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
    public routes(): any[] {
        return this._routes;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: IRouteOptions = {
            suffix: RoutesConstants.Suffix,
            urlPrefix: '',
            verbose: true,
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected loadAndAttach() {
        if (this._options.verbose) {
            const str: string = this._options.urlPrefix ? ` (prefix: '${this._options.urlPrefix}')` : '';
            console.log(`Loading routes${str}:`);
        }

        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }

                    global[RoutesConstants.GlobalConfigPointer] = this._configs;

                    const router: any = require(this._itemSpecs[i].path);
                    this._routes.push({
                        name: this._itemSpecs[i].name,
                        path: this._itemSpecs[i].path,
                        routes: router.stack
                            .filter((r: any) => (this._isKoa && r.path !== '*') || (!this._isKoa && r.route.path !== '*'))
                            .map((r: any) => {
                                return {
                                    uri: this._isKoa
                                        ? `/${this._itemSpecs[i].name}${r.path}`
                                        : `/${this._itemSpecs[i].name}${r.route.path}`,
                                    methods: this._isKoa
                                        ? r.methods
                                        : r.route.methods,
                                };
                            })
                    });
                    if (this._isKoa) {
                        router.prefix(`${this._options.urlPrefix}/${this._itemSpecs[i].name}`);
                        this._app.use(router.routes());
                    } else {
                        this._app.use(`${this._options.urlPrefix}/${this._itemSpecs[i].name}`, router);
                    }

                    delete global[RoutesConstants.GlobalConfigPointer];
                } catch (err) {
                    console.error(chalk.red(`Unable to load route '${this._itemSpecs[i].name}'.`), err);
                }
            }
        }
    }
}
