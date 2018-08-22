"use strict";
/**
 * @file promisify.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
const constants_1 = require("./constants");
/**
 * @class Promisify
 */
class Promisify extends Object {
    //
    // Public methods.
    registerFunction(methodName, func, strategy = constants_1.PromisifyStrategies.Default) {
        this.registerMethodOf(methodName, func, null, strategy);
    }
    registerMethodOf(methodName, func, parentObject, strategy = constants_1.PromisifyStrategies.Default) {
        if (typeof this[methodName] !== 'undefined') {
            throw `Method '${methodName}' is already registered`;
        }
        if (typeof strategy === 'function') {
            this[methodName] = strategy(func, parentObject);
        }
        else {
            switch (strategy) {
                case constants_1.PromisifyStrategies.Default:
                    this[methodName] = builder_1.PromisifyBuilder.DefaultStrategy(func, parentObject);
                    break;
                case constants_1.PromisifyStrategies.ErrorAndData:
                    this[methodName] = builder_1.PromisifyBuilder.ErrorAndData(func, parentObject);
                    break;
                default:
                    throw `Unknown strategy '${strategy}'`;
            }
        }
    }
}
exports.Promisify = Promisify;
