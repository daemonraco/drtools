"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookEvents = exports.HookConstants = void 0;
var HookConstants;
(function (HookConstants) {
    HookConstants[HookConstants["DefaultHookOrder"] = 1000] = "DefaultHookOrder";
})(HookConstants = exports.HookConstants || (exports.HookConstants = {}));
var HookEvents;
(function (HookEvents) {
    HookEvents["Hooked"] = "hooked";
    HookEvents["Unhooked"] = "unhooked";
})(HookEvents = exports.HookEvents || (exports.HookEvents = {}));
