/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as ajv from 'ajv';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { ExpressMiddleware } from '../express';
import { MockRoutesOptions, MockRoutesRoute } from '.';
import { Tools } from '../includes';

export class MockRoutesManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _configsValidator: any = null;
    protected _lastError: string = null;
    protected _options: MockRoutesOptions = null;
    protected _routes: { [uri: string]: MockRoutesRoute } = {};
    protected _routesConfig: any = {};
    protected _routesConfigPath: string = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(app: any, routesConfigPath: string, options: MockRoutesOptions = null, configs: ConfigsManager = null) {
        this._routesConfigPath = routesConfigPath;
        this._options = options;
        this._configs = configs;
        this.cleanParams();

        const ajvObj: any = new ajv({
            useDefaults: true
        });
        this._configsValidator = ajvObj.compile(require('../../assets/mock-routes.specs.json'));

        this.load();
        this.loadAndAttach(app);

        this._valid = !this._lastError;
    }
    //
    // Public methods.
    public config(): any {
        return this._routesConfig;
    }
    public configPath(): string {
        return this._routesConfigPath;
    }
    public lastError(): string {
        return this._lastError;
    }
    public routes(): MockRoutesRoute[] {
        let out: MockRoutesRoute[] = [];

        Object.keys(this._routes)
            .sort()
            .forEach((uri: string) => out.push(this._routes[uri]));

        return out;
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected cleanParams(): void {
        let defaultOptions: MockRoutesOptions = {
            verbose: true
        };
        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});

        this._routesConfigPath = this._routesConfigPath.match(/\.json$/) ? this._routesConfigPath : `${this._routesConfigPath}.json`;
    }
    protected load(): void {
        try {
            if (this._options.verbose) {
                console.log(`Loading mock-up routes:`);
                console.log(`\tConfig file: '${chalk.green(this.configPath())}'`);
            }

            this._routesConfig = require(this.configPath());

            if (typeof this._routesConfig.routes === 'object' && Array.isArray(this._routesConfig.routes)) {
                this._routesConfig.routes = {
                    '*': this._routesConfig.routes
                };
            }

            if (!this._configsValidator(this._routesConfig)) {
                this._lastError = `Bad configuration. '\$${this._configsValidator.errors[0].dataPath}' ${this._configsValidator.errors[0].message}`;
                console.error(chalk.red(this._lastError));
            }

            if (!this.lastError()) {
                Object.keys(this._routesConfig.routes).forEach((method: string) => {
                    method = method.toLowerCase();

                    this._routesConfig.routes[method].forEach((spec: any) => {
                        const filePath: string = MockRoutesManager.FullPathFromConfig(this.configPath(), spec.path);
                        let guardPath: string = null;
                        let guard: ExpressMiddleware = null;
                        let valid: boolean = true;

                        if (!fs.existsSync(filePath)) {
                            console.error(chalk.red(`Path '${spec.path}' does not exists`));
                            valid = false;
                        }

                        if (valid) {
                            if (typeof spec.guard !== 'undefined' && spec.guard) {
                                guardPath = spec.guard.match(/\.js$/) ? spec.guard : `${spec.guard}.js`;
                                guardPath = MockRoutesManager.FullPathFromConfig(this.configPath(), guardPath);

                                try {
                                    guard = require(guardPath);
                                } catch (e) {
                                    console.error(chalk.red(`Unable load '${guardPath}'. ${e}`));
                                    valid = false;
                                }
                            } else {
                                guard = (req: any, res: any, next: () => void) => next();
                            }
                        }

                        const route: MockRoutesRoute = {
                            uri: spec.uri,
                            path: filePath,
                            originalPath: spec.path,
                            mime: mime.lookup(filePath),
                            guard, guardPath, method, valid
                        };
                        this._routes[MockRoutesManager.RouteKey(route)] = route;
                    });
                });

                if (this._options.verbose) {
                    const keys: string[] = Object.keys(this._routes);

                    if (keys.length) {
                        console.log(`\tRoutes:`);
                        keys.sort().forEach((key: string) => {
                            const method: string = chalk.magenta(`[${this._routes[key].method.toUpperCase()}]`);
                            const file: string = chalk.magenta(this._routes[key].originalPath);
                            console.log(`\t\t- '${chalk.green(this._routes[key].uri)}' ${method} (file: '${file}')`);
                        });
                    }
                }
            } else {
                this._lastError = `No routes specified`;
                console.error(chalk.red(this._lastError));
            }
        } catch (e) {
            this._lastError = `${e}`;
            console.error(chalk.red(this._lastError));
        }
    }
    protected loadAndAttach(app: any): void {
        app.use((req: any, res: any, next: () => void) => {
            const methodKey: string = `${req.method.toLowerCase()}:${req._parsedUrl.pathname}`;
            const allMethodsKey: string = `*:${req._parsedUrl.pathname}`;
            let rightKey: string = typeof this._routes[methodKey] !== 'undefined' ? methodKey : null;
            rightKey = rightKey ? rightKey : typeof this._routes[allMethodsKey] !== 'undefined' ? allMethodsKey : null;

            const route: MockRoutesRoute = rightKey ? this._routes[rightKey] : null;
            if (route && route.valid) {
                route.guard(req, res, () => {
                    res.sendFile(route.path);
                });
            } else {
                next();
            }
        });
    }
    //
    // Protected class methods.
    protected static FullPathFromConfig(configPath: string, relativePath: string): string {
        let out: string = relativePath;

        const configDir: string = path.dirname(configPath);
        out = path.resolve(fs.existsSync(relativePath) ? relativePath : path.join(configDir, relativePath));

        return out;
    }
    protected static RouteKey(route: any): string {
        return `${route.method.toLowerCase()}:${route.uri}`;
    }
}
