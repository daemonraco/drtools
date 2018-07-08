/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { ajv, chalk, fs, mime, path } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { ExpressMiddleware } from '../express';
import { MockRoutesConstants, MockRoutesGuard, MockRoutesOptions, MockRoutesRoute } from '.';
import { Tools } from '../includes';

export class MockRoutesManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _configsValidator: any = null;
    protected _guards: { [name: string]: MockRoutesGuard } = {};
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
        this._configsValidator = ajvObj.compile(require('../../../assets/mock-routes.specs.json'));

        this.load();
        this.loadGuards();
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
    public configPath(): string {
        return this._routesConfigPath;
    }
    public guards(): MockRoutesGuard[] {
        let out: MockRoutesGuard[] = [];

        Object.keys(this._guards)
            .sort()
            .forEach((name: string) => out.push(this._guards[name]));

        return out;
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
    protected attach(app: any): void {
        if (!this.lastError()) {
            app.use((req: any, res: any, next: () => void) => {
                const pathname: string = decodeURIComponent(req._parsedUrl.pathname);
                const methodKey: string = `${req.method.toLowerCase()}:${pathname}`;
                const allMethodsKey: string = `*:${pathname}`;
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
    }
    protected cleanParams(): void {
        let defaultOptions: MockRoutesOptions = {
            verbose: true
        };
        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});

        this._routesConfigPath = this._routesConfigPath.match(/\.json$/) ? this._routesConfigPath : `${this._routesConfigPath}.json`;
    }
    protected fullPath(relativePath: string): string {
        let out: string = relativePath;

        const configDir: string = path.dirname(this.configPath());
        out = path.resolve(fs.existsSync(relativePath) ? relativePath : path.join(configDir, relativePath));

        return out;
    }
    protected load(): void {
        try {
            if (this._options.verbose) {
                console.log(`Loading mock-up routes:`);
                console.log(`\tConfig file: '${chalk.green(this.configPath())}'`);
            }
            //
            // Loading configuration.
            this._routesConfig = require(path.resolve(this.configPath()));
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
        } catch (e) {
            this._lastError = `${e}`;
            console.error(chalk.red(this._lastError));
        }
    }
    protected loadGuard(guardSpec: any): MockRoutesGuard {
        let out: MockRoutesGuard = {
            name: guardSpec.name,
            path: guardSpec.path,
            guard: undefined
        };

        out.path = out.path.match(/\.js$/) ? out.path : `${out.path}.js`;
        out.path = this.fullPath(out.path);

        try {
            out.guard = require(out.path);
        } catch (e) {
            out.error = `Unable to load '${out.path}'. ${e}`;
        }

        return out;
    }
    protected loadGuards(): void {
        //
        // Loading guards.
        if (!this.lastError()) {
            this._guards[MockRoutesConstants.DefaultGuard] = {
                name: MockRoutesConstants.DefaultGuard,
                path: null,
                guard: (req: any, res: any, next: () => void) => next()
            };

            this._routesConfig.guards.forEach((guard: any) => {
                this._guards[guard.name] = this.loadGuard(guard);

                if (this._guards[guard.name].error) {
                    console.log(chalk.red(this._guards[guard.name].error));
                }
            });
        }
    }
    protected loadRoutes(): void {
        //
        // Loading routes.
        if (!this.lastError()) {
            Object.keys(this._routesConfig.routes).forEach((method: string) => {
                method = method.toLowerCase();

                this._routesConfig.routes[method].forEach((spec: any) => {
                    const filePath: string = this.fullPath(spec.path);

                    let error: string = undefined;
                    let guard: ExpressMiddleware = null;
                    let guardPath: string = null;
                    let guardName: string = null;
                    let valid: boolean = true;

                    if (!fs.existsSync(filePath)) {
                        error = `Path '${spec.path}' does not exists`;
                        console.error(chalk.red(error));
                        valid = false;
                    }

                    if (valid) {
                        if (spec.guard) {
                            const loadedGuard: MockRoutesGuard = this.loadGuard({
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

                            if (typeof this._guards[guardName] !== 'undefined') {
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

                    const route: MockRoutesRoute = {
                        uri: spec.uri,
                        path: filePath,
                        originalPath: spec.path,
                        mime: mime.lookup(filePath),
                        guard, guardName, guardPath, method, valid, error
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
    }
    //
    // Protected class methods.
    protected static RouteKey(route: any): string {
        return `${route.method.toLowerCase()}:${route.uri}`;
    }
}
