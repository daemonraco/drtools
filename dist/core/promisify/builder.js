"use strict";
/**
 * @file builder.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class PromisifyBuilder
 */
class PromisifyBuilder {
    //
    // Construction.
    constructor() {
    }
    //
    // Public factory methods.
    static DefaultStrategy(func, parentObject) {
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;
        const result = function () {
            const args = Array.from(arguments);
            return new Promise((resolve, reject) => {
                args.push((data) => {
                    resolve(data);
                });
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);
        return result;
    }
    static ErrorAndData(func, parentObject) {
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;
        const result = function () {
            const args = Array.from(arguments);
            return new Promise((resolve, reject) => {
                args.push((error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
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
exports.PromisifyBuilder = PromisifyBuilder;
