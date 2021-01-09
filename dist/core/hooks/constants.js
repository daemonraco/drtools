"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookEvents = exports.HookConstants = void 0;
class HookConstants {
    constructor() { }
}
exports.HookConstants = HookConstants;
HookConstants.DefaultHookOrder = 1000;
class HookEvents {
    constructor() { }
}
exports.HookEvents = HookEvents;
HookEvents.Hooked = 'hooked';
HookEvents.Unhooked = 'unhooked';
