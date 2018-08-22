/**
 * @file promisify.ts
 * @author Alejandro D. Simi
 */

import { PromisifyBuilder } from './builder';
import { PromisifyStrategies } from './constants';

declare var Promise: any;

/**
 * @class Promisify
 */
export class Promisify extends Object {
    //
    // Signature.
    [key: string]: any;
    //
    // Public methods.
    public registerFunction(methodName: string, func: Function, strategy: Function | string = PromisifyStrategies.Default): void {
        this.registerMethodOf(methodName, func, null, strategy);
    }
    public registerMethodOf(methodName: string, func: Function, parentObject: object, strategy: Function | string = PromisifyStrategies.Default): void {
        if (typeof this[methodName] !== 'undefined') {
            throw `Method '${methodName}' is already registered`;
        }

        if (typeof strategy === 'function') {
            this[methodName] = strategy(func, parentObject);
        } else {
            switch (strategy) {
                case PromisifyStrategies.Default:
                    this[methodName] = PromisifyBuilder.DefaultStrategy(func, parentObject);
                    break;
                case PromisifyStrategies.ErrorAndData:
                    this[methodName] = PromisifyBuilder.ErrorAndData(func, parentObject);
                    break;
                default:
                    throw `Unknown strategy '${strategy}'`;
            }
        }
    }
}
