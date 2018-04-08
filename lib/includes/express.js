"use strict";
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../configs/constants");
const manager_1 = require("../configs/manager");
const tools_1 = require("./tools");
class ExpressConnector {
    //
    // Constructor.
    constructor() { }
    //
    // Public methods.
    attach(app, options = {}) {
        //
        // Cleaning options.
        let defaultOptions = {
            configsOptions: {},
            publishConfigs: false
        };
        options = tools_1.Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results = {};
        //
        // Attaching a configs manager.
        results.configs = this.attachConfigs(app, options);
        return results;
    }
    //
    // Protected methods.
    attachConfigs(app, options) {
        let manager = null;
        if (options.configsDirectory) {
            manager = new manager_1.ConfigsManager(options.configsDirectory, options.configsOptions);
            if (options.publishConfigs) {
                const uri = typeof options.publishConfigs === 'string' ? options.publishConfigs : constants_1.ConfigsConstants.PublishUri;
                app.use(manager.publishExports(uri));
            }
        }
        return manager;
    }
    //
    // Public class methods.
    static Instance() {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }
        return ExpressConnector._Instance;
    }
}
//
// Private class properties.
ExpressConnector._Instance = null;
exports.ExpressConnector = ExpressConnector;
