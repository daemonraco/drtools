"use strict";
/**
 * @file builder.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
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
    static DataAndError(func, parentObject) {
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;
        const result = function () {
            const args = Array.from(arguments);
            return new Promise((resolve, reject) => {
                args.push((data, error) => {
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
    static DataAndErrorCallbacks(func, parentObject) {
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;
        const result = function () {
            const args = Array.from(arguments);
            return new Promise((resolve, reject) => {
                args.push(resolve);
                args.push(reject);
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);
        return result;
    }
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
    static ErrorAndDataCallbacks(func, parentObject) {
        const PROMESIFY_BUILDER_METHOD_POINTER = func;
        const PROMESIFY_BUILDER_METHOD_PARENT = parentObject;
        const result = function () {
            const args = Array.from(arguments);
            return new Promise((resolve, reject) => {
                args.push(reject);
                args.push(resolve);
                PROMESIFY_BUILDER_METHOD_POINTER.apply(PROMESIFY_BUILDER_METHOD_PARENT, args);
            });
        };
        result.bind(PROMESIFY_BUILDER_METHOD_POINTER);
        result.bind(PROMESIFY_BUILDER_METHOD_PARENT);
        return result;
    }
    static Factory(strategy, func, parentObject) {
        let result = null;
        const factories = PromisifyBuilder.FactoryByType();
        if (typeof factories[strategy] !== 'undefined') {
            result = factories[strategy](func, parentObject);
        }
        else {
            throw `Unknown strategy '${strategy}'`;
        }
        return result;
    }
    //
    // Protected class methods.
    static FactoryByType() {
        if (PromisifyBuilder.BuildersByType === null) {
            PromisifyBuilder.BuildersByType = {};
            PromisifyBuilder.BuildersByType[`${constants_1.PromisifyStrategies.DataAndError}`] = PromisifyBuilder.DataAndError;
            PromisifyBuilder.BuildersByType[`${constants_1.PromisifyStrategies.DataAndErrorCallbacks}`] = PromisifyBuilder.DataAndErrorCallbacks;
            PromisifyBuilder.BuildersByType[`${constants_1.PromisifyStrategies.Default}`] = PromisifyBuilder.DefaultStrategy;
            PromisifyBuilder.BuildersByType[`${constants_1.PromisifyStrategies.ErrorAndData}`] = PromisifyBuilder.ErrorAndData;
            PromisifyBuilder.BuildersByType[`${constants_1.PromisifyStrategies.ErrorAndDataCallbacks}`] = PromisifyBuilder.ErrorAndDataCallbacks;
        }
        return PromisifyBuilder.BuildersByType;
    }
}
//
// Protected class properties.
PromisifyBuilder.BuildersByType = null;
exports.PromisifyBuilder = PromisifyBuilder;
