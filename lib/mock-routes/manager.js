"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._lastError = null;
        this._options = null;
        this._routes = {};
        this._routesConfig = {};
        this._routesConfigPath = null;
        this._valid = false;
        this._routesConfigPath = routesConfigPath;
        this._options = options;
        this._configs = configs;
        this.cleanOptions();
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
    cleanOptions() {
        let defaultOptions = {
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    load() {
        try {
            this._routesConfig = require(this.configPath());
            if (typeof this._routesConfig.routes === 'object' && Array.isArray(this._routesConfig.routes)) {
                this._routesConfig.routes = {
                    '*': this._routesConfig.routes
                };
            }
            if (typeof this._routesConfig.routes === 'object') {
                const configDir = path.dirname(this.configPath());
                Object.keys(this._routesConfig.routes).forEach((method) => {
                    method = method.toLowerCase();
                    this._routesConfig.routes[method].forEach((spec) => {
                        const key = `${method.toLowerCase()}:${spec.uri}`;
                        const filePath = path.resolve(fs.existsSync(spec.path) ? spec.path : path.join(configDir, spec.path));
                        const valid = fs.existsSync(filePath);
                        this._routes[key] = {
                            uri: spec.uri,
                            path: filePath,
                            mime: mime.lookup(filePath),
                            method, valid
                        };
                        if (!valid) {
                            this._lastError = `Path '${spec.path}' does not exists`;
                            console.error(chalk.red(this._lastError));
                        }
                    });
                });
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
                res.sendFile(route.path);
            }
            else {
                next();
            }
        });
    }
}
exports.MockRoutesManager = MockRoutesManager;
