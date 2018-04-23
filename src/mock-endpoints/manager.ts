/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { Endpoint, EndpointBrief, EndpointsManagerOptions, EndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
import { Tools } from '../includes';

export class EndpointsManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _endpointsDirectory: string = null;
    protected _endpointsUri: string = null;
    protected _lastError: string = null;
    protected _options: EndpointsManagerOptions = null;
    protected _provider: Endpoint = null;
    protected _valid: boolean = false;
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
    public directory(): string {
        return this._endpointsDirectory;
    }
    public lastError(): string {
        return this._lastError;
    }
    public options(): EndpointOptions {
        return this._options.options;
    }
    public paths(): EndpointBrief[] {
        return this._provider.paths();
    }
    public provide(): ExpressMiddleware {
        return this.valid() ? this._provider.expressMiddleware() : this.provideInvalidMiddleware();
    }
    public valid(): boolean {
        return this._valid;
    }
    public uri(): string {
        return this._endpointsUri;
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
        //
        // Checking given directory path.
        let stat: any = null;
        try { stat = fs.statSync(this._options.directory); } catch (e) { }
        if (!stat) {
            this._lastError = `'${this._options.directory}' does not exist.`;
            console.error(chalk.red(this._lastError));
        } else if (!stat.isDirectory()) {
            this._lastError = `'${this._options.directory}' is not a directory.`;
            console.error(chalk.red(this._lastError));
        }
        //
        // Basic paths.
        if (!this._lastError) {
            this._provider = new Endpoint(this._options.directory, this._options.uri, this._options.options);
            this._endpointsDirectory = this._provider.directory();
            this._endpointsUri = this._provider.uri();
        }

        this._valid = !this._lastError;
    }
    protected provideInvalidMiddleware(): ExpressMiddleware {
        return (req: any, res: any, next: () => void) => {
            console.error(chalk.red(`EndpointsManager Error: ${this._lastError}`));
            next();
        }
    }
}
