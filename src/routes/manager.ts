/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';

import { ConfigsManager } from '../configs';
import { GenericManager, Tools } from '../includes';
import { RoutesConstants, RouteOptions } from '.';

declare const global: any;

export class RoutesManager extends GenericManager<RouteOptions> {
    //
    // Protected properties.
    protected _routes: any[] = [];
    //
    // Constructor.
    constructor(app: any, directory: string, options: RouteOptions = {}, configs: ConfigsManager) {
        super(directory, options, configs);
        this.loadAndAttach(app);
        this._valid = !this._lastError;
    }
    //
    // Public methods.
    public routes(): any[] {
        return this._routes;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: RouteOptions = {
            suffix: RoutesConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected load() {
        // Nothing to do here.
    }
    protected loadAndAttach(app: any) {
        if (this._options.verbose) {
            console.log(`Loading routes:`);
        }

        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }

                    global.configs = this._configs;

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
                    app.use(`/${this._itemSpecs[i].name}`, router);

                    delete global.configs;
                } catch (e) {
                    console.error(chalk.red(`Unable to load route '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
