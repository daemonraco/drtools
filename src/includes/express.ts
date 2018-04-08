/**
 * @file express.ts
 * @author Alejandro D. Simi
 */

import { ConfigsConstants } from '../configs/constants';
import { ConfigsManager } from '../configs/manager';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from './express-types';
import { OptionsList } from './basic-types';
import { Tools } from './tools';

export class ExpressConnector {
    //
    // Private class properties.
    private static _Instance: ExpressConnector = null;
    //
    // Constructor.
    private constructor() { }
    //
    // Public methods.
    public attach(app: any, options: ExpressConnectorOptions = {}): ExpressConnectorAttachResults {
        //
        // Cleaning options.
        let defaultOptions: ExpressConnectorOptions = {
            configsOptions: {},
            publishConfigs: false
        };
        options = Tools.DeepMergeObjects(defaultOptions, options);
        //
        // Default values.
        let results: ExpressConnectorAttachResults = {};
        //
        // Attaching a configs manager.
        results.configs = this.attachConfigs(app, options);

        return results;
    }
    //
    // Protected methods.
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager {
        let manager: ConfigsManager = null;

        if (options.configsDirectory) {
            manager = new ConfigsManager(options.configsDirectory, options.configsOptions);

            if (options.publishConfigs) {
                const uri: string = typeof options.publishConfigs === 'string' ? options.publishConfigs : ConfigsConstants.PublishUri;
                app.use(manager.publishExports(uri));
            }
        }

        return manager;
    }
    //
    // Public class methods.
    public static Instance(): ExpressConnector {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }

        return ExpressConnector._Instance;
    }
}