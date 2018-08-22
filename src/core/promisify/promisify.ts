/**
 * @file promisify.ts
 * @author Alejandro D. Simi
 */

import { PromisifyBuilder } from './builder';
import { PromisifyStrategies } from './constants';
import { util } from '../../libraries';

declare var Promise: any;

/**
 * @class Promisify
 */
export class Promisify extends Object {
    //
    // Signature.
    [key: string]: Function;
    //
    // Public methods.
    public registerFunction(methodName: string, func: Function, strategy: Function | string = PromisifyStrategies.Default): void {
        this.registerMethodOf(methodName, func, null, strategy);
    }
    public registerMethodOf(methodName: string, func: Function, parentObject: object, strategy: Function | string = PromisifyStrategies.Default): void {
        if (typeof this[methodName] !== 'undefined') {
            throw `Method '${methodName}' is already registered`;
        }

        let method: Function = null;
        if (typeof strategy === 'function') {
            this[methodName] = method = strategy(func, parentObject);
        } else {
            this[methodName] = method = PromisifyBuilder.Factory(strategy, func, parentObject);
        }

        if (method !== null) {
            (<any>func)[util.promisify.custom] = method;
        }
    }
}
