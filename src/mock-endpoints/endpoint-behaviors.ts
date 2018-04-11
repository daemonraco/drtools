/**
 * @file endpoint-behaviors.ts
 * @author Alejandro D. Simi
 */

import * as fs from 'fs';
import * as loremIpsum from 'lorem-ipsum';
import * as path from 'path';

export class EndpointBehaviors extends Object {
    [key: string]: any;
    //
    // Protected class properties.
    protected static _PrivateBehaviors: string[] = [
        'importBehaviors'
    ]
    //
    // Constructor.
    constructor() {
        super();
    }
    //
    // Basic behaviors.
    lorem(params: any): any {
        return params === null ? loremIpsum() : loremIpsum(params);
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
    //
    // Protected methods.
}
