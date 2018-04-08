"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const constants_1 = require("./constants");
const tools_1 = require("../includes/tools");
class RoutesManager {
    //
    // Constructor.
    constructor(app, routesDirectory, options = {}) {
        //
        // Protected properties.
        this._routesDirectory = null;
        this._options = null;
        this._options = options;
        this.cleanOptions();
        this.load(app, routesDirectory);
    }
    //
    // Public methods.
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: constants_1.RoutesConstants.Suffix,
            verbose: false
        };
        this._options = tools_1.Tools.DeepMergeObjects(defaultOptions, this._options);
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
        let routes = [];
        if (!error) {
            //
            // Basic paths and patterns.
            this._routesDirectory = routesDirectory;
            const routesPattern = new RegExp(`^(.*)\\.${this._options.suffix}\\.(json|js)$`);
            routes = fs.readdirSync(this._routesDirectory)
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
        if (!error && routes.length > 0) {
            if (this._options.verbose) {
                console.log(`Loading routes:`);
            }
            for (let i in routes) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(routes[i].name)}'`);
                    }
                    app.use(routes[i].uri, require(routes[i].path));
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load route '${routes[i].name}'.\n\t${e}`));
                }
            }
        }
    }
}
exports.RoutesManager = RoutesManager;
