/**
 * @file endpoint.ts
 * @author Alejandro D. Simi
 */

import { fs, glob, path } from '../../libraries';

import { EndpointBrief, EndpointBrievesByMethod, EndpointData, EndpointOptions, EndpointPathPattern } from '.';
import { ExpressMiddleware } from '../express';
import { Tools } from '../includes';

export class Endpoint {
    //
    // Protected properties.
    protected _dirPath: string = '';
    protected _loaded: boolean = false;
    protected _loadedEndpoints: { [path: string]: EndpointData } = {};
    protected _restPath: string = '';
    protected _restPattern: RegExp = null;
    protected _options: EndpointOptions = null;
    //
    // Constructor.
    public constructor(dirPath: string, restPath: string, options: EndpointOptions = {}) {
        this._dirPath = dirPath;
        this._restPath = restPath;
        this._options = options;

        this.fixConstructorParams();
        this.load();
    }
    //
    // Public methods.
    public paths(): EndpointBrief[] {
        const out: EndpointBrief[] = [];

        this.loadAllEndpoints();
        Object.keys(this._loadedEndpoints).sort().forEach((path: string) => {
            const brieves: EndpointBrievesByMethod = this._loadedEndpoints[path].brievesByMethod();
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

                if (result.status === 200) {
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
    public responseFor(endpoint: string, method: string, simple: boolean = false): { [name: string]: any } {
        let out: { [name: string]: any } = {
            status: 200,
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
    protected load(): void {
        if (!this._loaded) {
            this._loaded = true;

            let stat: any = null;
            try { stat = fs.statSync(this._dirPath); } catch (e) { }

            if (stat && stat.isDirectory()) {
                this._dirPath = path.resolve(this._dirPath);
            } else if (stat && !stat.isDirectory()) {
                throw `Path '${this._dirPath}' is not a directory.`
            } else {
                throw `Path '${this._dirPath}' is not a valid path.`
            }
        }
    }
    protected loadAllEndpoints(): void {
        const paths: string[] = glob.sync(path.join(this.directory(), '**/*.json'));
        const directoryLength = this.directory().length;

        let uris: string[] = [];
        paths.forEach((p: string) => {
            const matches: string[] = p.match(EndpointPathPattern);
            if (matches) {
                let uri: string;

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
    protected loadEndpoint(endpoint: string): void {
        if (typeof this._loadedEndpoints[endpoint] === 'undefined') {
            this._loadedEndpoints[endpoint] = new EndpointData(this, endpoint, this._options);
        }
    }
}
