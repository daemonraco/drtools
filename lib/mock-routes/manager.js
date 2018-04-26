"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
const chalk = require("chalk");
const fs = require("fs");
const mime = require("mime-types");
const path = require("path");
const includes_1 = require("../includes");
class MockRoutesManager {
    //
    // Constructor.
    constructor(app, routesConfigPath, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._configsValidator = null;
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
        const ajvObj = new ajv({
            useDefaults: true
        });
        this._configsValidator = ajvObj.compile(require('../../assets/mock-routes.specs.json'));
        this.load();
        this.loadAndAttach(app);
        this._valid = !this._lastError;
    }
    //
    // Public methods.
    config() {
        return this._routesConfig;
    }
    configPath() {
        return this._routesConfigPath;
    }
    lastError() {
        return this._lastError;
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
    cleanParams() {
        let defaultOptions = {
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
        this._routesConfigPath = this._routesConfigPath.match(/\.json$/) ? this._routesConfigPath : `${this._routesConfigPath}.json`;
    }
    load() {
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
                Object.keys(this._routesConfig.routes).forEach((method) => {
                    method = method.toLowerCase();
                    this._routesConfig.routes[method].forEach((spec) => {
                        const filePath = MockRoutesManager.FullPathFromConfig(this.configPath(), spec.path);
                        let guardPath = null;
                        let guard = null;
                        let valid = true;
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
                                }
                                catch (e) {
                                    console.error(chalk.red(`Unable load '${guardPath}'. ${e}`));
                                    valid = false;
                                }
                            }
                            else {
                                guard = (req, res, next) => next();
                            }
                        }
                        const route = {
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
                    const keys = Object.keys(this._routes);
                    if (keys.length) {
                        console.log(`\tRoutes:`);
                        keys.sort().forEach((key) => {
                            const method = chalk.magenta(`[${this._routes[key].method.toUpperCase()}]`);
                            const file = chalk.magenta(this._routes[key].originalPath);
                            console.log(`\t\t- '${chalk.green(this._routes[key].uri)}' ${method} (file: '${file}')`);
                        });
                    }
                }
            }
            else {
                this._lastError = `No routes specified`;
                console.error(chalk.red(this._lastError));
            }
        }
        catch (e) {
            this._lastError = `${e}`;
            console.error(chalk.red(this._lastError));
        }
    }
    loadAndAttach(app) {
        app.use((req, res, next) => {
            const methodKey = `${req.method.toLowerCase()}:${req._parsedUrl.pathname}`;
            const allMethodsKey = `*:${req._parsedUrl.pathname}`;
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
    //
    // Protected class methods.
    static FullPathFromConfig(configPath, relativePath) {
        let out = relativePath;
        const configDir = path.dirname(configPath);
        out = path.resolve(fs.existsSync(relativePath) ? relativePath : path.join(configDir, relativePath));
        return out;
    }
    static RouteKey(route) {
        return `${route.method.toLowerCase()}:${route.uri}`;
    }
}
exports.MockRoutesManager = MockRoutesManager;
