"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const _1 = require(".");
const includes_1 = require("../includes");
class RoutesManager {
    //
    // Constructor.
    constructor(app, directory, options = {}, configs) {
        //
        // Protected properties.
        this._configs = null;
        this._directory = null;
        this._lastError = null;
        this._options = null;
        this._routes = [];
        this._valid = false;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load(app, directory);
    }
    //
    // Public methods.
    directory() {
        return this._directory;
    }
    lastError() {
        return this._lastError;
    }
    routes() {
        return this._routes.map((r) => r.name);
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.RoutesConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    load(app, directory) {
        if (this._options.verbose) {
            console.log(`Loading routes:`);
        }
        //
        // Checking given directory path.
        let stat = null;
        try {
            stat = fs.statSync(directory);
        }
        catch (e) { }
        if (!stat) {
            this._lastError = `'${directory}' does not exist.`;
            console.error(chalk.red(this._lastError));
        }
        else if (!stat.isDirectory()) {
            this._lastError = `'${directory}' is not a directory.`;
            console.error(chalk.red(this._lastError));
        }
        if (!this._lastError) {
            //
            // Basic paths and patterns.
            this._directory = directory;
            const routesPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            this._routes = fs.readdirSync(this._directory)
                .filter(x => x.match(routesPattern))
                .map(x => {
                const o = {
                    name: x.replace(routesPattern, '$1'),
                    path: path.join(this._directory, x)
                };
                o.uri = `/${o.name}`;
                return o;
            });
        }
        if (!this._lastError && this._routes.length > 0) {
            for (let i in this._routes) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._routes[i].name)}'`);
                    }
                    global.configs = this._configs;
                    app.use(this._routes[i].uri, require(this._routes[i].path));
                    delete global.configs;
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load route '${this._routes[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.RoutesManager = RoutesManager;
