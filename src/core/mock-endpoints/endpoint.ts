/**
 * @file endpoint.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
import { IEndpointBrief, IEndpointBrievesByMethod, EndpointData, IEndpointOptions, EndpointPathPattern } from '.';
import { KoaMiddleware } from '../koa';
import { StatusCodes } from 'http-status-codes';
import { Tools, ToolsCheckPath } from '../includes';
import * as path from 'path';
import glob from 'glob';

export class Endpoint {
    //
    // Protected properties.
    protected _dirPath: string = '';
    protected _loaded: boolean = false;
    protected _loadedEndpoints: { [path: string]: EndpointData } = {};
    protected _restPath: string = '';
    protected _restPattern: RegExp | null = null;
    protected _options: IEndpointOptions = {};
    //
    // Constructor.
    public constructor(dirPath: string, restPath: string, options: IEndpointOptions = {}) {
        this._dirPath = dirPath;
        this._restPath = restPath;
        this._options = options;

        this.fixConstructorParams();
        this.load();
    }
    //
    // Public methods.
    public paths(): IEndpointBrief[] {
        const out: IEndpointBrief[] = [];

        this.loadAllEndpoints();
        Object.keys(this._loadedEndpoints).sort().forEach((path: string) => {
            const brieves: IEndpointBrievesByMethod = this._loadedEndpoints[path].brievesByMethod();
            Object.keys(brieves).forEach((method: string) => {
                out.push(brieves[method]);
            });
        });

        return out;
    }
    public directory(): string {
        return this._dirPath;
    }
    public expressMiddleware(): ExpressMiddleware {
        return (req: any, res: any, next: any) => {
            const match = req.url.match(this._restPattern);
            if (match) {
                const result = this.responseFor(match[2], req.method);

                res.header('Content-Type', 'application/json');

                if (result.status === StatusCodes.OK) {
                    res.status(result.status).json(result.data);
                } else {
                    res.status(result.status).json({
                        status: result.status,
                        message: result.message,
                        data: result.data
                    });
                }
            } else {
                next();
            }
        };
    }
    public koaMiddleware(): KoaMiddleware {
        return async (ctx: any, next: any): Promise<void> => {
            const match = ctx.url.match(this._restPattern);
            if (match) {
                const result = this.responseFor(match[2], ctx.method);

                ctx.set('Content-Type', 'application/json');

                if (result.status === StatusCodes.OK) {
                    ctx.body = result.data;
                } else {
                    ctx.throw(result.status, {
                        status: result.status,
                        message: result.message,
                        data: result.data
                    });
                }
            } else {
                await next();
            }
        };
    }
    public responseFor(endpoint: string, method?: string, simple: boolean = false): { [name: string]: any } {
        let out: { [name: string]: any } = {
            status: StatusCodes.OK,
            message: null,
            data: {}
        };

        this.loadEndpoint(endpoint);
        out = this._loadedEndpoints[endpoint].data(method);

        return simple ? out.data : out;
    }
    public uri(): string {
        return this._restPath;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected fixConstructorParams(): void {
        //
        // Cleaning URI @{
        this._restPath = `/${this._restPath}/`;
        [
            ['//', '/']
        ].forEach((pair: any) => {
            while (this._restPath.indexOf(pair[0]) > -1) {
                this._restPath = this._restPath.replace(pair[0], pair[1]);
            }
        });
        this._restPath = this._restPath.substr(0, this._restPath.length - 1);
        const uriForPattern = this._restPath.replace(/\//g, '\\/').replace(/\./g, '\\.');
        // @}

        this._restPattern = new RegExp(`^${uriForPattern}([\\/]?)(.*)$`);
        //
        // Fixing options.
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        } else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    /* istanbul ignore next */
    protected load(): void {
        if (!this._loaded) {
            this._loaded = true;

            const check = Tools.CheckDirectory(this._dirPath, process.cwd());
            switch (check.status) {
                case ToolsCheckPath.Ok:
                    this._dirPath = check.path;
                    break;
                case ToolsCheckPath.WrongType:
                    throw `Path '${this._dirPath}' is not a directory.`;
                default:
                    throw `Path '${this._dirPath}' is not a valid path.`;
            }
        }
    }
    /* istanbul ignore next */
    protected loadAllEndpoints(): void {
        const paths: string[] = glob.sync(path.join(this.directory(), '**/*.json'));
        const directoryLength = this.directory().length;

        let uris: string[] = [];
        paths.forEach((p: string) => {
            const matches: RegExpMatchArray | null = p.match(EndpointPathPattern);
            if (matches) {
                if (matches[2] === '_METHODS') {
                    uris.push(matches[4]);
                } else {
                    uris.push(p.substr(directoryLength + 1).replace(/\.json$/, ''));
                }
            }
        });

        uris.forEach((u: string) => {
            this.loadEndpoint(u);
        });
    }
    /* istanbul ignore next */
    protected loadEndpoint(endpoint: string): void {
        if (this._loadedEndpoints[endpoint] === undefined) {
            this._loadedEndpoints[endpoint] = new EndpointData(this, endpoint, this._options);
        }
    }
}
