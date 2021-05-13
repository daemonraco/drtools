"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRoutesManager = void 0;
const tslib_1 = require("tslib");
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
const mime = require('mime');
const drcollector_1 = require("../drcollector");
const _1 = require(".");
const includes_1 = require("../includes");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const url = tslib_1.__importStar(require("url"));
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const koa_send_1 = tslib_1.__importDefault(require("koa-send"));
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
        const ajvObj = new ajv_1.default({
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
    options() {
        return this._options;
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
    /* istanbul ignore next */
    attach(app) {
        if (!this.lastError()) {
            if (includes_1.Tools.IsExpress(app)) {
                app.use((req, res, next) => {
                    const pathname = decodeURIComponent(req._parsedUrl.pathname);
                    const methodKey = `${req.method.toLowerCase()}:${pathname}`;
                    const allMethodsKey = `*:${pathname}`;
                    let rightKey = this._routes[methodKey] !== undefined ? methodKey : null;
                    rightKey = rightKey ? rightKey : this._routes[allMethodsKey] !== undefined ? allMethodsKey : null;
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
                app.use((ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const parsedUrl = url.parse(ctx.originalUrl);
                    const pathname = decodeURIComponent(parsedUrl.pathname);
                    const methodKey = `${ctx.method.toLowerCase()}:${pathname}`;
                    const allMethodsKey = `*:${pathname}`;
                    let rightKey = this._routes[methodKey] !== undefined ? methodKey : null;
                    rightKey = rightKey ? rightKey : this._routes[allMethodsKey] !== undefined ? allMethodsKey : null;
                    const route = rightKey ? this._routes[rightKey] : null;
                    if (route && route.valid) {
                        route.guard(ctx, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            yield koa_send_1.default(ctx, route.path);
                        }));
                    }
                    else {
                        yield next();
                    }
                }));
            }
            else {
                this._lastError = `Unknown app type`;
                console.error(chalk_1.default.red(this._lastError));
            }
        }
    }
    /* istanbul ignore next */
    cleanParams() {
        let defaultOptions = {
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
        this._routesConfigPath = this._routesConfigPath && this._routesConfigPath.match(/\.json$/)
            ? this._routesConfigPath
            : `${this._routesConfigPath}.json`;
    }
    /* istanbul ignore next */
    fullPath(relativePath) {
        let out = relativePath;
        if (!this.configPath()) {
            throw new Error('No config path given.');
        }
        const configDir = path.dirname(this.configPath());
        out = path.resolve(fs.existsSync(relativePath) ? relativePath : path.join(configDir, relativePath));
        return out;
    }
    /* istanbul ignore next */
    load(isExpress) {
        var _a;
        try {
            if (!this.configPath()) {
                throw new Error('No config path given.');
            }
            if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
                console.log(`Loading mock-up routes:`);
                console.log(`${includes_1.TAB}Config file: '${chalk_1.default.green(this.configPath())}'`);
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
                console.error(chalk_1.default.red(this._lastError));
            }
        }
        catch (err) {
            this._lastError = `${err}`;
            console.error(chalk_1.default.red(this._lastError), err);
        }
    }
    /* istanbul ignore next */
    loadGuard(guardSpec) {
        let out = {
            name: guardSpec.name,
            path: guardSpec.path,
        };
        out.path = out.path.match(/\.js$/) ? out.path : `${out.path}.js`;
        if (out.path) {
            out.path = this.fullPath(out.path);
        }
        try {
            out.guard = require(out.path);
        }
        catch (e) {
            out.error = `Unable to load '${out.path}'. ${e}`;
        }
        return out;
    }
    /* istanbul ignore next */
    loadGuards(isExpress) {
        //
        // Loading guards.
        if (!this.lastError()) {
            this._guards[_1.MockRoutesConstants.DefaultGuard] = {
                name: _1.MockRoutesConstants.DefaultGuard,
                guard: isExpress
                    ? (req, res, next) => next()
                    : (ctx, next) => next(),
            };
            this._routesConfig.guards.forEach((guard) => {
                this._guards[guard.name] = this.loadGuard(guard);
                if (this._guards[guard.name].error) {
                    console.log(chalk_1.default.red(this._guards[guard.name].error));
                }
            });
        }
    }
    /* istanbul ignore next */
    loadRoutes() {
        var _a;
        //
        // Loading routes.
        if (!this.lastError()) {
            Object.keys(this._routesConfig.routes).forEach((method) => {
                method = method.toLowerCase();
                this._routesConfig.routes[method].forEach((spec) => {
                    const filePath = this.fullPath(spec.path);
                    let error = undefined;
                    let guard = undefined;
                    let guardPath = undefined;
                    let guardName = undefined;
                    let valid = true;
                    if (!fs.existsSync(filePath)) {
                        error = `Path '${spec.path}' does not exists`;
                        console.error(chalk_1.default.red(error));
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
                                console.error(chalk_1.default.red(loadedGuard.error));
                                valid = false;
                            }
                        }
                        else if (spec.guardName) {
                            guardName = spec.guardName;
                            if (guardName && this._guards[guardName] !== undefined) {
                                guard = this._guards[guardName].guard;
                            }
                            else {
                                error = `Unknown guard name '${guardName}'`;
                                console.error(chalk_1.default.red(error));
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
                        mime: mime.lookup(filePath) || '',
                        guard, guardName, guardPath, method, valid, error
                    };
                    this._routes[MockRoutesManager.RouteKey(route)] = route;
                });
            });
            if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
                const keys = Object.keys(this._routes);
                if (keys.length) {
                    console.log(`${includes_1.TAB}Routes:`);
                    keys.sort().forEach((key) => {
                        const method = chalk_1.default.magenta(`[${this._routes[key].method.toUpperCase()}]`);
                        const file = chalk_1.default.magenta(this._routes[key].originalPath);
                        console.log(`${includes_1.TAB2}- '${chalk_1.default.green(this._routes[key].uri)}' ${method} (file: '${file}')`);
                    });
                }
            }
        }
        else {
            this._lastError = `No routes specified`;
            console.error(chalk_1.default.red(this._lastError));
        }
    }
    //
    // Protected class methods.
    /* istanbul ignore next */
    static RouteKey(route) {
        return `${route.method.toLowerCase()}:${route.uri}`;
    }
}
exports.MockRoutesManager = MockRoutesManager;
