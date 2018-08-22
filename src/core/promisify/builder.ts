/**
 * @file builder.ts
 * @author Alejandro D. Simi
 */

declare var Promise: any;

type GenericFunction = (...args: any[]) => void;

/**
 * @class PromisifyBuilder
 */
export class PromisifyBuilder {
    //
    // Construction.
    protected constructor() {
    }
    //
    // Public factory methods.
    public static DefaultStrategy(func: Function, parentObject: object): Function {
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;

        const result = function () {
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
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;

        const result = function () {
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
}
