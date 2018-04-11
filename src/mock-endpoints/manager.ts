/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { Endpoint, EndpointsManagerOptions } from '.';
import { ExpressMiddleware } from '../express';
import { Tools } from '../includes';

export class EndpointsManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _provider: Endpoint = null;
    protected _endpointsDirectory: string = null;
    protected _endpointsUri: string = null;
    protected _options: EndpointsManagerOptions = null;
    //
    // Constructor.
    constructor(options: EndpointsManagerOptions, configs: ConfigsManager = null) {
        this._configs = configs;
        this._options = options;
        this.cleanOptions();

        this.load();
    }
    //
    // Public methods.
    public provide(): ExpressMiddleware {
        return this._provider.expressMiddleware();
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: EndpointsManagerOptions = {
            directory: '',
            uri: '',
            options: {}
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    protected load() {
        let error: boolean = false;
        //
        // Checking given directory path.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(this._options.directory); } catch (e) { }
            if (!stat) {
                console.error(`'${this._options.directory}' does not exist.`);
                error = true;
            } else if (!stat.isDirectory()) {
                console.error(`'${this._options.directory}' is not a directory.`);
                error = true;
            }
        }
        //
        // Basic paths.
        if (!error) {
            this._endpointsDirectory = this._options.directory;
            this._endpointsUri = this._options.uri;
            this._provider = new Endpoint(this._endpointsDirectory, this._endpointsUri, this._options);
        }
    }
}
