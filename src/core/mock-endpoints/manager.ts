/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { DRCollector, IManagerByKey } from '../drcollector';
import { Endpoint, IEndpointBrief, IEndpointsManagerOptions, IEndpointOptions } from '.';
import { ExpressMiddleware } from '../express';
import { KoaMiddleware } from '../koa';
import { Tools, ToolsCheckPath } from '../includes';
import chalk from 'chalk';

export class EndpointsManager implements IManagerByKey {
    //
    // Protected properties.
    protected _configs: ConfigsManager | null = null;
    protected _endpointsDirectory: string = '';
    protected _endpointsUri: string = '';
    protected _lastError: string | null = null;
    protected _options: IEndpointsManagerOptions = { directory: '', uri: '' };
    protected _provider: Endpoint | null = null;
    protected _valid: boolean = false;
    //
    // Constructor.
    constructor(options: IEndpointsManagerOptions, configs: ConfigsManager | null = null) {
        this._configs = configs;
        this._options = options;
        this.cleanOptions();

        this.load();

        DRCollector.registerEndpointsManager(this);
    }
    //
    // Public methods.
    public directory(): string {
        return this._endpointsDirectory;
    }
    public lastError(): string | null {
        return this._lastError;
    }
    public matchesKey(key: string): boolean {
        return this.directory() === key;
    }
    public options(): IEndpointOptions | null {
        return this._options.options || null;
    }
    public paths(): IEndpointBrief[] {
        return this._provider ? this._provider.paths() : [];
    }
    public provide(): ExpressMiddleware {
        return this.valid() && this._provider ? this._provider.expressMiddleware() : this.provideInvalidMiddleware();
    }
    public provideForKoa(): KoaMiddleware {
        return this.valid() && this._provider ? this._provider.koaMiddleware() : this.provideInvalidKoaMiddleware();
    }
    public valid(): boolean {
        return this._valid;
    }
    public uri(): string {
        return this._endpointsUri;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected cleanOptions(): void {
        let defaultOptions: IEndpointsManagerOptions = {
            directory: '',
            uri: '',
            options: {},
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options);
    }
    /* istanbul ignore next */
    protected load() {
        //
        // Checking given directory path.
        const check = Tools.CheckDirectory(this._options.directory, process.cwd());
        switch (check.status) {
            case ToolsCheckPath.Ok:
                this._options.directory = check.path;
                break;
            case ToolsCheckPath.WrongType:
                this._lastError = `'${this._options.directory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
                break;
            default:
                this._lastError = `'${this._options.directory}' does not exist.`;
                console.error(chalk.red(this._lastError));
                break;
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
    /* istanbul ignore next */
    protected provideInvalidKoaMiddleware(): KoaMiddleware {
        return async (ctx: any, next: () => void): Promise<void> => {
            console.error(chalk.red(`EndpointsManager Error: ${this._lastError}`));
            await next();
        }
    }
    /* istanbul ignore next */
    protected provideInvalidMiddleware(): ExpressMiddleware {
        return (req: any, res: any, next: () => void) => {
            console.error(chalk.red(`EndpointsManager Error: ${this._lastError}`));
            next();
        }
    }
}
