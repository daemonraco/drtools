/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
const mime = require('mime');
import { ConfigsManager } from '../configs';
import { DRCollector, IManagerByKey } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { IMockRoutesGuard, IMockRoutesOptions, IMockRoutesRoute, MockRoutesConstants } from '.';
import { TAB, TAB2, Tools } from '../includes';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as url from 'url';
import Ajv from 'ajv';
import chalk from 'chalk';
import koaSend from 'koa-send';

export class MockRoutesManager implements IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager | null = null;
    protected _configsValidator: any = null;
    protected _guards: { [name: string]: IMockRoutesGuard } = {};
    protected _lastError: string | null = null;
    protected _options: IMockRoutesOptions | null = null;
    protected _routes: { [uri: string]: IMockRoutesRoute } = {};
    protected _routesConfig: any = {};
    protected _routesConfigPath: string | null = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(app: any, routesConfigPath: string, options: IMockRoutesOptions | null = null, configs: ConfigsManager | null = null) {
        this._routesConfigPath = routesConfigPath;
        this._options = options;
        this._configs = configs;
        this.cleanParams();

        const ajvObj: any = new Ajv({
            useDefaults: true
        });
        this._configsValidator = ajvObj.compile(require('../../../assets/mock-routes.specs.json'));

        const isExpress: boolean = Tools.IsExpress(app);

        this.load(isExpress);
        this.loadGuards(isExpress);
        this.loadRoutes();
        this.attach(app);

        this._valid = !this._lastError;

        DRCollector.registerMockRoutesManager(this);
    }
    //
    // Public methods.
    public config(): any {
        return this._routesConfig;
    }
    public configPath(): string | null {
        return this._routesConfigPath;
    }
    public guards(): IMockRoutesGuard[] {
        let out: IMockRoutesGuard[] = [];

        Object.keys(this._guards)
            .sort()
            .forEach((name: string) => out.push(this._guards[name]));

        return out;
    }
    public lastError(): string | null {
        return this._lastError;
    }
    public matchesKey(key: string): boolean {
        return this.configPath() === key;
    }
    public options(): IMockRoutesOptions | null {
        return this._options;
    }
    public routes(): IMockRoutesRoute[] {
        let out: IMockRoutesRoute[] = [];

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
    /* istanbul ignore next */
    protected attach(app: any): void {
        if (!this.lastError()) {
            if (Tools.IsExpress(app)) {
                app.use((req: any, res: any, next: () => void) => {
                    const pathname: string = decodeURIComponent(req._parsedUrl.pathname);
                    const methodKey: string = `${req.method.toLowerCase()}:${pathname}`;
                    const allMethodsKey: string = `*:${pathname}`;
                    let rightKey: string | null = this._routes[methodKey] !== undefined ? methodKey : null;
                    rightKey = rightKey ? rightKey : this._routes[allMethodsKey] !== undefined ? allMethodsKey : null;

                    const route: IMockRoutesRoute | null = rightKey ? this._routes[rightKey] : null;
                    if (route && route.valid) {
                        route.guard(req, res, () => {
                            res.sendFile(route.path);
                        });
                    } else {
                        next();
                    }
                });
            } else if (Tools.IsKoa(app)) {
                app.use(async (ctx: any, next: () => void): Promise<any> => {
                    const parsedUrl: any = url.parse(ctx.originalUrl);

                    const pathname: string = decodeURIComponent(parsedUrl.pathname);
                    const methodKey: string = `${ctx.method.toLowerCase()}:${pathname}`;
                    const allMethodsKey: string = `*:${pathname}`;
                    let rightKey: string | null = this._routes[methodKey] !== undefined ? methodKey : null;
                    rightKey = rightKey ? rightKey : this._routes[allMethodsKey] !== undefined ? allMethodsKey : null;

                    const route: IMockRoutesRoute | null = rightKey ? this._routes[rightKey] : null;
                    if (route && route.valid) {
                        route.guard(ctx, async (): Promise<any> => {
                            await koaSend(ctx, route.path);
                        });
                    } else {
                        await next();
                    }
                });
            } else {
                this._lastError = `Unknown app type`;
                console.error(chalk.red(this._lastError));
            }
        }
    }
    /* istanbul ignore next */
    protected cleanParams(): void {
        let defaultOptions: IMockRoutesOptions = {
            verbose: true
        };
        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});

        this._routesConfigPath = this._routesConfigPath && this._routesConfigPath.match(/\.json$/)
            ? this._routesConfigPath
            : `${this._routesConfigPath}.json`;
    }
    /* istanbul ignore next */
    protected fullPath(relativePath: string): string {
        let out: string = relativePath;

        if (!this.configPath()) {
            throw new Error('No config path given.');
        }

        const configDir: string = path.dirname(<string>this.configPath());
        out = path.resolve(fs.existsSync(relativePath) ? relativePath : path.join(configDir, relativePath));

        return out;
    }
    /* istanbul ignore next */
    protected load(isExpress: boolean): void {
        try {
            if (!this.configPath()) {
                throw new Error('No config path given.');
            }

            if (this._options?.verbose) {
                console.log(`Loading mock-up routes:`);
                console.log(`${TAB}Config file: '${chalk.green(this.configPath())}'`);
            }
            //
            // Loading configuration.
            this._routesConfig = require(path.resolve(<string>this.configPath()));
            //
            // Fixing parameters.
            if (typeof this._routesConfig.routes === 'object' && Array.isArray(this._routesConfig.routes)) {
                this._routesConfig.routes = {
                    '*': this._routesConfig.routes
                };
            }
            //
            // Checking configuration.
            if (!this._configsValidator(this._routesConfig)) {
                this._lastError = `Bad configuration. '\$${this._configsValidator.errors[0].dataPath}' ${this._configsValidator.errors[0].message}`;
                console.error(chalk.red(this._lastError));
            }
        } catch (err) {
            this._lastError = `${err}`;
            console.error(chalk.red(this._lastError), err);
        }
    }
    /* istanbul ignore next */
    protected loadGuard(guardSpec: any): IMockRoutesGuard {
        let out: IMockRoutesGuard = {
            name: guardSpec.name,
            path: guardSpec.path,
        };

        out.path = (<string>out.path).match(/\.js$/) ? out.path : `${out.path}.js`;
        if (out.path) {
            out.path = this.fullPath(out.path);
        }

        try {
            out.guard = require(<string>out.path);
        } catch (e) {
            out.error = `Unable to load '${out.path}'. ${e}`;
        }

        return out;
    }
    /* istanbul ignore next */
    protected loadGuards(isExpress: boolean): void {
        //
        // Loading guards.
        if (!this.lastError()) {
            this._guards[MockRoutesConstants.DefaultGuard] = {
                name: MockRoutesConstants.DefaultGuard,
                guard: isExpress
                    ? (req: any, res: any, next: () => void) => next()
                    : (ctx: any, next: () => void) => next(),
            };

            this._routesConfig.guards.forEach((guard: any) => {
                this._guards[guard.name] = this.loadGuard(guard);

                if (this._guards[guard.name].error) {
                    console.log(chalk.red(this._guards[guard.name].error));
                }
            });
        }
    }
    /* istanbul ignore next */
    protected loadRoutes(): void {
        //
        // Loading routes.
        if (!this.lastError()) {
            Object.keys(this._routesConfig.routes).forEach((method: string) => {
                method = method.toLowerCase();

                this._routesConfig.routes[method].forEach((spec: any) => {
                    const filePath: string = this.fullPath(spec.path);

                    let error: string | undefined = undefined;
                    let guard: ExpressMiddleware | undefined = undefined;
                    let guardPath: string | undefined = undefined;
                    let guardName: string | undefined = undefined;
                    let valid: boolean = true;

                    if (!fs.existsSync(filePath)) {
                        error = `Path '${spec.path}' does not exists`;
                        console.error(chalk.red(error));
                        valid = false;
                    }

                    if (valid) {
                        if (spec.guard) {
                            const loadedGuard: IMockRoutesGuard = this.loadGuard({
                                name: null,
                                path: spec.guard
                            });
                            guardPath = loadedGuard.path;

                            if (!loadedGuard.error) {
                                guard = loadedGuard.guard;
                            } else {
                                error = loadedGuard.error;
                                console.error(chalk.red(loadedGuard.error));
                                valid = false;
                            }
                        } else if (spec.guardName) {
                            guardName = spec.guardName;

                            if (guardName && this._guards[guardName] !== undefined) {
                                guard = this._guards[guardName].guard;
                            } else {
                                error = `Unknown guard name '${guardName}'`;
                                console.error(chalk.red(error));
                                valid = false;
                            }
                        } else {
                            guard = this._guards[MockRoutesConstants.DefaultGuard].guard;
                        }
                    }

                    const route: IMockRoutesRoute = {
                        uri: spec.uri,
                        path: filePath,
                        originalPath: spec.path,
                        mime: mime.lookup(filePath) || '',
                        guard, guardName, guardPath, method, valid, error
                    };
                    this._routes[MockRoutesManager.RouteKey(route)] = route;
                });
            });

            if (this._options?.verbose) {
                const keys: string[] = Object.keys(this._routes);

                if (keys.length) {
                    console.log(`${TAB}Routes:`);
                    keys.sort().forEach((key: string) => {
                        const method: string = chalk.magenta(`[${this._routes[key].method.toUpperCase()}]`);
                        const file: string = chalk.magenta(this._routes[key].originalPath);
                        console.log(`${TAB2}- '${chalk.green(this._routes[key].uri)}' ${method} (file: '${file}')`);
                    });
                }
            }
        } else {
            this._lastError = `No routes specified`;
            console.error(chalk.red(this._lastError));
        }
    }
    //
    // Protected class methods.
    /* istanbul ignore next */
    protected static RouteKey(route: any): string {
        return `${route.method.toLowerCase()}:${route.uri}`;
    }
}
