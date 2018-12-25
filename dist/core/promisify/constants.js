"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class PromisifyStrategies
 */
class PromisifyStrategies {
    constructor() { }
}
PromisifyStrategies.DataAndError = 'data-and-error';
PromisifyStrategies.DataAndErrorCallbacks = 'data-and-error-callbacks';
PromisifyStrategies.Default = 'default';
PromisifyStrategies.ErrorAndData = 'error-and-data';
PromisifyStrategies.ErrorAndDataCallbacks = 'error-and-data-callbacks';
PromisifyStrategies.JustError = 'just-error';
exports.PromisifyStrategies = PromisifyStrategies;
