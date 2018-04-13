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
    constructor(app, routesDirectory, options = {}, configs) {
        //
        // Protected properties.
        this._configs = null;
        this._routes = [];
        this._routesDirectory = null;
        this._options = null;
        this._configs = configs;
        this._options = options;
        this.cleanOptions();
        this.load(app, routesDirectory);
    }
    //
    // Public methods.
    routes() {
        return this._routes.map((r) => r.name);
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
    load(app, routesDirectory) {
        let error = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat = null;
            try {
                stat = fs.statSync(routesDirectory);
            }
            catch (e) { }
            if (!stat) {
                console.error(`'${routesDirectory}' does not exist.`);
                error = true;
            }
            else if (!stat.isDirectory()) {
                console.error(`'${routesDirectory}' is not a directory.`);
                error = true;
            }
        }
        if (!error) {
            //
            // Basic paths and patterns.
            this._routesDirectory = routesDirectory;
            const routesPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            this._routes = fs.readdirSync(this._routesDirectory)
                .filter(x => x.match(routesPattern))
                .map(x => {
                const o = {
                    name: x.replace(routesPattern, '$1'),
                    path: path.join(this._routesDirectory, x)
                };
                o.uri = `/${o.name}`;
                return o;
            });
        }
        if (!error && this._routes.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading routes:`);
            }
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
