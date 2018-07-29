/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, Tools } from '../includes';
import { RoutesConstants, IRouteOptions } from '.';

declare const global: any;

export class RoutesManager extends GenericManager<IRouteOptions> {
    //
    // Protected properties.
    protected _expressApp: any = null;
    protected _routes: any[] = [];
    //
    // Constructor.
    constructor(app: any, directory: string, options: IRouteOptions = {}, configs: ConfigsManager) {
        super(directory, options, configs);
        this._expressApp = app;
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
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected loadAndAttach() {
        if (this._options.verbose) {
            console.log(`Loading routes:`);
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
                            .filter((r: any) => r.route.path !== '*')
                            .map((r: any) => {
                                return {
                                    uri: `/${this._itemSpecs[i].name}${r.route.path}`,
                                    methods: r.route.methods
                                };
                            })
                    });
                    this._expressApp.use(`/${this._itemSpecs[i].name}`, router);

                    delete global[RoutesConstants.GlobalConfigPointer];
                } catch (e) {
                    console.error(chalk.red(`Unable to load route '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
