"use strict";
/**
 * @file promisify.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
const constants_1 = require("./constants");
const libraries_1 = require("../../libraries");
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
        let method = null;
        if (typeof strategy === 'function') {
            this[methodName] = method = strategy(func, parentObject);
        }
        else {
            this[methodName] = method = builder_1.PromisifyBuilder.Factory(strategy, func, parentObject);
        }
        if (method !== null) {
            func[libraries_1.util.promisify.custom] = method;
        }
    }
}
exports.Promisify = Promisify;
