/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import * as chalk from 'chalk';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

import { ConfigsManager } from '../configs';
import { MockRoutesOptions, MockRoutesRoute } from '.';
import { Tools } from '../includes';

export class MockRoutesManager {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _lastError: string = null;
    protected _options: MockRoutesOptions = null;
    protected _routes: { [uri: string]: MockRoutesRoute } = {};
    protected _routesConfig: any = {};
    protected _routesConfigPath: string = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(app: any, routesConfigPath: string, options: MockRoutesOptions = null, configs: ConfigsManager = null) {
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
    public config(): any {
        return this._routesConfig;
    }
    public configPath(): string {
        return this._routesConfigPath;
    }
    public lastError(): string {
        return this._lastError;
    }
    public routes(): MockRoutesRoute[] {
        let out: MockRoutesRoute[] = [];

        Object.keys(this._routes)
            .sort()
            .forEach((uri: string) => out.push(this._routes[uri]));

        return out;
    }
    public valid(): boolean {
        return this._valid;
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: MockRoutesOptions = {
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected load(): void {
        try {
            this._routesConfig = require(this.configPath());

            if (typeof this._routesConfig.routes === 'object' && Array.isArray(this._routesConfig.routes)) {
                this._routesConfig.routes = {
                    '*': this._routesConfig.routes
                };
            }

            if (typeof this._routesConfig.routes === 'object') {
                const configDir: string = path.dirname(this.configPath());

                Object.keys(this._routesConfig.routes).forEach((method: string) => {
                    method = method.toLowerCase();

                    this._routesConfig.routes[method].forEach((spec: any) => {
                        const key: string = `${method.toLowerCase()}:${spec.uri}`;
                        const filePath: string = path.resolve(fs.existsSync(spec.path) ? spec.path : path.join(configDir, spec.path));
                        const valid: boolean = fs.existsSync(filePath);

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
            } else {
                this._lastError = `No routes specified`;
                console.error(chalk.red(this._lastError));
            }
        } catch (e) {
            this._lastError = `${e}`;
            console.error(chalk.red(this._lastError));
        }
    }
    protected loadAndAttach(app: any): void {
        app.use((req: any, res: any, next: () => void) => {
            const methodKey: string = `${req.method.toLowerCase()}:${req._parsedUrl.pathname}`;
            const allMethodsKey: string = `*:${req._parsedUrl.pathname}`;
            let rightKey: string = typeof this._routes[methodKey] !== 'undefined' ? methodKey : null;
            rightKey = rightKey ? rightKey : typeof this._routes[allMethodsKey] !== 'undefined' ? allMethodsKey : null;

            const route: MockRoutesRoute = rightKey ? this._routes[rightKey] : null;
            if (route && route.valid) {
                res.sendFile(route.path);
            } else {
                next();
            }
        });
    }
}
