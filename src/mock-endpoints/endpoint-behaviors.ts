/**
 * @file endpoint-behaviors.ts
 * @author Alejandro D. Simi
 */

import { fs, glob, loremIpsum, path } from '../includes/libraries';

import { Endpoint } from '.';

export class EndpointBehaviors extends Object {
    [key: string]: any;
    //
    // Protected class properties.
    protected static _PrivateBehaviors: string[] = [
        'importBehaviors'
    ]
    //
    // Protected properties.
    protected _endpoint: Endpoint = null;
    //
    // Constructor.
    constructor(endpoint: Endpoint) {
        super();

        this._endpoint = endpoint;
    }
    //
    // Basic behaviors.
    public endpoint(endpointPath: string, method: string = null): any {
        let out: any = undefined;

        const fullPath: string = path.join(this._endpoint.directory(), `${endpointPath}.json`);
        if (fs.existsSync(fullPath)) {
            out = this._endpoint.responseFor(endpointPath, method, true);
        } else {
            const rootPath = this._endpoint.directory();
            const filter = /^(.*)\.json$/i;
            out = glob.sync(fullPath)
                .filter((p: string) => p.match(filter))
                .filter((p: string) => p.indexOf(rootPath) === 0)
                .map((p: string) => p.substr(rootPath.length + 1))
                .map((p: string) => p.replace(filter, '$1'))
                .map((ep: string) => this._endpoint.responseFor(ep, method, true));

            if (out.length === 0) {
                out = this._endpoint.responseFor(endpointPath, method);
            }
        }

        return out;
    }
    public lorem(params: any): any {
        return params === null ? loremIpsum() : loremIpsum(params);
    }
    public randNumber(...args: any[]): number {
        let max: number = 100;
        let min: number = 0;
        let out: number = 0;

        if (args[0] === null) {
            args = [];
        }

        if (Array.isArray(args[0])) {
            if (args[0].length > 0) {
                max = parseInt(args[0][0]);
            }
            if (args[0].length > 1) {
                min = parseInt(args[0][1]);
            }
        } else if (typeof args[0] === 'object') {
            if (typeof args[0].max !== 'undefined') {
                max = parseInt(args[0].max);
            }
            if (typeof args[0].min !== 'undefined') {
                min = parseInt(args[0].min);
            }
        } else {
            if (typeof args[0] !== 'undefined') {
                max = parseInt(args[0]);
            }
            if (typeof args[1] !== 'undefined') {
                min = parseInt(args[1]);
            }
        }

        if (min > max) {
            let aux: number = max;
            max = min;
            min = aux;
        }

        out = Math.floor(Math.random() * (max - min + 1)) + min;

        return out;
    }
    public randString(length: number = null): string {
        if (length === null) {
            length = 10;
        }

        let out: string = '';

        while (out.length < length) {
            out += Math.random().toString(36).substring(7);
        }

        return out.substr(0, length);
    }
    //
    // Public methods.
    public importBehaviors(behaviors: any): void {
        if (behaviors && typeof behaviors === 'object' && !Array.isArray(behaviors)) {
            Object.keys(behaviors).forEach((key: string) => {
                if (EndpointBehaviors._PrivateBehaviors.indexOf(key) < 0 && typeof behaviors[key] !== 'undefined') {
                    this[key] = behaviors[key];
                }
            });
        }
    }
}
