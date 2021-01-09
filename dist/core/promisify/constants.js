"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromisifyStrategies = void 0;
/**
 * @class PromisifyStrategies
 */
class PromisifyStrategies {
    constructor() { }
}
exports.PromisifyStrategies = PromisifyStrategies;
PromisifyStrategies.DataAndError = 'data-and-error';
PromisifyStrategies.DataAndErrorCallbacks = 'data-and-error-callbacks';
PromisifyStrategies.Default = 'default';
PromisifyStrategies.ErrorAndData = 'error-and-data';
PromisifyStrategies.ErrorAndDataCallbacks = 'error-and-data-callbacks';
PromisifyStrategies.JustError = 'just-error';
