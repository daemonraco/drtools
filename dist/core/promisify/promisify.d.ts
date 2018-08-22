/**
 * @file promisify.ts
 * @author Alejandro D. Simi
 */
/**
 * @class Promisify
 */
export declare class Promisify extends Object {
    [key: string]: Function;
    registerFunction(methodName: string, func: Function, strategy?: Function | string): void;
    registerMethodOf(methodName: string, func: Function, parentObject: object, strategy?: Function | string): void;
}
