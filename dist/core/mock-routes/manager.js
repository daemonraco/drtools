"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const _1 = require(".");
const includes_1 = require("../includes");
class MockRoutesManager {
    //
    // Constructor.
    constructor(app, routesConfigPath, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._configsValidator = null;
        this._guards = {};
        this._lastError = null;
        this._options = null;
        this._routes = {};
        this._routesConfig = {};
        this._routesConfigPath = null;
        this._valid = false;
        this._routesConfigPath = routesConfigPath;
        this._options = options;
        this._configs = configs;
        this.cleanParams();
        const ajvObj = new libraries_1.ajv({
            useDefaults: true
        });
        this._configsValidator = ajvObj.compile(require('../../../assets/mock-routes.specs.json'));
        const isExpress = includes_1.Tools.IsExpress(app);
        this.load(isExpress);
        this.loadGuards(isExpress);
        this.loadRoutes();
        this.attach(app);
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerMockRoutesManager(this);
    }
    //
    // Public methods.
    config() {
        return this._routesConfig;
    }
    configPath() {
        return this._routesConfigPath;
    }
    guards() {
        let out = [];
        Object.keys(this._guards)
            .sort()
            .forEach((name) => out.push(this._guards[name]));
        return out;
    }
    lastError() {
        return this._lastError;
    }
    matchesKey(key) {
        return this.configPath() === key;
    }
    routes() {
        let out = [];
        Object.keys(this._routes)
            .sort()
            .forEach((uri) => out.push(this._routes[uri]));
        return out;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    attach(app) {
        if (!this.lastError()) {
            if (includes_1.Tools.IsExpress(app)) {
                app.use((req, res, next) => {
                    const pathname = decodeURIComponent(req._parsedUrl.pathname);
                    const methodKey = `${req.method.toLowerCase()}:${pathname}`;
                    const allMethodsKey = `*:${pathname}`;
                    let rightKey = typeof this._routes[methodKey] !== 'undefined' ? methodKey : null;
                    rightKey = rightKey ? rightKey : typeof this._routes[allMethodsKey] !== 'undefined' ? allMethodsKey : null;
                    const route = rightKey ? this._routes[rightKey] : null;
                    if (route && route.valid) {
                        route.guard(req, res, () => {
                            res.sendFile(route.path);
                        });
                    }
                    else {
                        next();
                    }
                });
            }
            else if (includes_1.Tools.IsKoa(app)) {
                app.use(async (ctx, next) => {
                    const parsedUrl = libraries_1.url.parse(ctx.originalUrl);
                    const pathname = decodeURIComponent(parsedUrl.pathname);
                    const methodKey = `${ctx.method.toLowerCase()}:${pathname}`;
                    const allMethodsKey = `*:${pathname}`;
                    let rightKey = typeof this._routes[methodKey] !== 'undefined' ? methodKey : null;
                    rightKey = rightKey ? rightKey : typeof this._routes[allMethodsKey] !== 'undefined' ? allMethodsKey : null;
                    const route = rightKey ? this._routes[rightKey] : null;
                    if (route && route.valid) {
                        route.guard(ctx, async () => {
                            await libraries_1.koaSend(ctx, route.path);
                        });
                    }
                    else {
                        await next();
                    }
                });
            }
            else {
                this._lastError = `Unknown app type`;
                console.error(libraries_1.chalk.red(this._lastError));
            }
        }
    }
    cleanParams() {
        let defaultOptions = {
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
        this._routesConfigPath = this._routesConfigPath.match(/\.json$/) ? this._routesConfigPath : `${this._routesConfigPath}.json`;
    }
    fullPath(relativePath) {
        let out = relativePath;
        const configDir = libraries_1.path.dirname(this.configPath());
        out = libraries_1.path.resolve(libraries_1.fs.existsSync(relativePath) ? relativePath : libraries_1.path.join(configDir, relativePath));
        return out;
    }
    load(isExpress) {
        try {
            if (this._options.verbose) {
                console.log(`Loading mock-up routes:`);
                console.log(`\tConfig file: '${libraries_1.chalk.green(this.configPath())}'`);
            }
            //
            // Loading configuration.
            this._routesConfig = require(libraries_1.path.resolve(this.configPath()));
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
                console.error(libraries_1.chalk.red(this._lastError));
            }
        }
        catch (err) {
            this._lastError = `${err}`;
            console.error(libraries_1.chalk.red(this._lastError), err);
        }
    }
    loadGuard(guardSpec) {
        let out = {
            name: guardSpec.name,
            path: guardSpec.path,
            guard: undefined
        };
        out.path = out.path.match(/\.js$/) ? out.path : `${out.path}.js`;
        out.path = this.fullPath(out.path);
        try {
            out.guard = require(out.path);
        }
        catch (e) {
            out.error = `Unable to load '${out.path}'. ${e}`;
        }
        return out;
    }
    loadGuards(isExpress) {
        //
        // Loading guards.
        if (!this.lastError()) {
            this._guards[_1.MockRoutesConstants.DefaultGuard] = {
                name: _1.MockRoutesConstants.DefaultGuard,
                path: null,
                guard: isExpress
                    ? (req, res, next) => next()
                    : (ctx, next) => next(),
            };
            this._routesConfig.guards.forEach((guard) => {
                this._guards[guard.name] = this.loadGuard(guard);
                if (this._guards[guard.name].error) {
                    console.log(libraries_1.chalk.red(this._guards[guard.name].error));
                }
            });
        }
    }
    loadRoutes() {
        //
        // Loading routes.
        if (!this.lastError()) {
            Object.keys(this._routesConfig.routes).forEach((method) => {
                method = method.toLowerCase();
                this._routesConfig.routes[method].forEach((spec) => {
                    const filePath = this.fullPath(spec.path);
                    let error = undefined;
                    let guard = null;
                    let guardPath = null;
                    let guardName = null;
                    let valid = true;
                    if (!libraries_1.fs.existsSync(filePath)) {
                        error = `Path '${spec.path}' does not exists`;
                        console.error(libraries_1.chalk.red(error));
                        valid = false;
                    }
                    if (valid) {
                        if (spec.guard) {
                            const loadedGuard = this.loadGuard({
                                name: null,
                                path: spec.guard
                            });
                            guardPath = loadedGuard.path;
                            if (!loadedGuard.error) {
                                guard = loadedGuard.guard;
                            }
                            else {
                                error = loadedGuard.error;
                                console.error(libraries_1.chalk.red(loadedGuard.error));
                                valid = false;
                            }
                        }
                        else if (spec.guardName) {
                            guardName = spec.guardName;
                            if (typeof this._guards[guardName] !== 'undefined') {
                                guard = this._guards[guardName].guard;
                            }
                            else {
                                error = `Unknown guard name '${guardName}'`;
                                console.error(libraries_1.chalk.red(error));
                                valid = false;
                            }
                        }
                        else {
                            guard = this._guards[_1.MockRoutesConstants.DefaultGuard].guard;
                        }
                    }
                    const route = {
                        uri: spec.uri,
                        path: filePath,
                        originalPath: spec.path,
                        mime: libraries_1.mime.lookup(filePath),
                        guard, guardName, guardPath, method, valid, error
                    };
                    this._routes[MockRoutesManager.RouteKey(route)] = route;
                });
            });
            if (this._options.verbose) {
                const keys = Object.keys(this._routes);
                if (keys.length) {
                    console.log(`\tRoutes:`);
                    keys.sort().forEach((key) => {
                        const method = libraries_1.chalk.magenta(`[${this._routes[key].method.toUpperCase()}]`);
                        const file = libraries_1.chalk.magenta(this._routes[key].originalPath);
                        console.log(`\t\t- '${libraries_1.chalk.green(this._routes[key].uri)}' ${method} (file: '${file}')`);
                    });
                }
            }
        }
        else {
            this._lastError = `No routes specified`;
            console.error(libraries_1.chalk.red(this._lastError));
        }
    }
    //
    // Protected class methods.
    static RouteKey(route) {
        return `${route.method.toLowerCase()}:${route.uri}`;
    }
}
exports.MockRoutesManager = MockRoutesManager;
