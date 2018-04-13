/**
 * @file endpoint-behaviors.ts
 * @author Alejandro D. Simi
 */

import * as fs from 'fs';
import * as loremIpsum from 'lorem-ipsum';
import * as path from 'path';

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
