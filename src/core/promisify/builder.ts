/**
 * @file builder.ts
 * @author Alejandro D. Simi
 */

import { PromisifyStrategies } from './constants';

type GenericFunction = (...args: any[]) => void;

declare var Promise: any;

/**
 * @class PromisifyBuilder
 */
export class PromisifyBuilder {
    //
    // Protected class properties.
    protected static BuildersByType: { [key: string]: Function } = null;
    //
    // Construction.
    protected constructor() {
    }
    //
    // Public factory methods.
    public static DataAndError(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER: Function = func;
        const PROMESIFY_BUILDER_METHOD_PARENT: object = parentObject;

        const result: Function = function () {
            const args: any[] = Array.from(arguments);
            return new Promise((resolve: GenericFunction, reject: GenericFunction) => {
                args.push((data: any, error: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);

        return result;
    }
    public static DataAndErrorCallbacks(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER: Function = func;
        const PROMESIFY_BUILDER_METHOD_PARENT: object = parentObject;

        const result: Function = function () {
            const args: any[] = Array.from(arguments);
            return new Promise((resolve: GenericFunction, reject: GenericFunction) => {
                args.push(resolve);
                args.push(reject);
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);

        return result;
    }
    public static DefaultStrategy(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER: Function = func;
        const PROMESIFY_BUILDER_METHOD_PARENT: object = parentObject;

        const result: Function = function () {
            const args: any[] = Array.from(arguments);
            return new Promise((resolve: GenericFunction, reject: GenericFunction) => {
                args.push((data: any) => {
                    resolve(data);
                });
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);

        return result;
    }
    public static ErrorAndData(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER: Function = func;
        const PROMESIFY_BUILDER_METHOD_PARENT: object = parentObject;

        const result: Function = function () {
            const args: any[] = Array.from(arguments);
            return new Promise((resolve: GenericFunction, reject: GenericFunction) => {
                args.push((error: any, data: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);

        return result;
    }
    public static ErrorAndDataCallbacks(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER: Function = func;
        const PROMESIFY_BUILDER_METHOD_PARENT: object = parentObject;

        const result: Function = function () {
            const args: any[] = Array.from(arguments);
            return new Promise((resolve: GenericFunction, reject: GenericFunction) => {
                args.push(reject);
                args.push(resolve);
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);

        return result;
    }
    public static Factory(strategy: string, func: Function, parentObject: object): Function {
        let result: Function = null;

        const factories = PromisifyBuilder.FactoryByType();
        if (typeof factories[strategy] !== 'undefined') {
            result = factories[strategy](func, parentObject);
        } else {
            throw `Unknown strategy '${strategy}'`;
        }

        return result;
    }
    public static JustError(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER: Function = func;
        const PROMESIFY_BUILDER_METHOD_PARENT: object = parentObject;

        const result: Function = function () {
            const args: any[] = Array.from(arguments);
            return new Promise((resolve: GenericFunction, reject: GenericFunction) => {
                args.push((error: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);

        return result;
    }
    //
    // Protected class methods.
    protected static FactoryByType() {
        if (PromisifyBuilder.BuildersByType === null) {
            PromisifyBuilder.BuildersByType = {};
            PromisifyBuilder.BuildersByType[`${PromisifyStrategies.DataAndError}`] = PromisifyBuilder.DataAndError;
            PromisifyBuilder.BuildersByType[`${PromisifyStrategies.DataAndErrorCallbacks}`] = PromisifyBuilder.DataAndErrorCallbacks;
            PromisifyBuilder.BuildersByType[`${PromisifyStrategies.Default}`] = PromisifyBuilder.DefaultStrategy;
            PromisifyBuilder.BuildersByType[`${PromisifyStrategies.ErrorAndData}`] = PromisifyBuilder.ErrorAndData;
            PromisifyBuilder.BuildersByType[`${PromisifyStrategies.ErrorAndDataCallbacks}`] = PromisifyBuilder.ErrorAndDataCallbacks;
            PromisifyBuilder.BuildersByType[`${PromisifyStrategies.JustError}`] = PromisifyBuilder.JustError;
        }

        return PromisifyBuilder.BuildersByType;
    }
}
