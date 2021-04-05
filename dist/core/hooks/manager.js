"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooksManager = void 0;
const hook_1 = require("./hook");
class HooksManagerClass {
    //
    // Constructors.
    constructor() {
        //
        // Protected properties.
        this._hooks = {};
    }
    //
    // Public methods.
    get(key) {
        if (this._hooks[key] === undefined) {
            this._hooks[key] = new hook_1.Hook(key);
        }
        return this._hooks[key];
    }
    keys() {
        return Object.keys(this._hooks);
    }
    //
    // Public class methods.
    static Instance() {
        if (!HooksManagerClass._Instance) {
            HooksManagerClass._Instance = new HooksManagerClass();
        }
        return HooksManagerClass._Instance;
    }
}
//
// Protected class properties.
HooksManagerClass._Instance = null;
exports.HooksManager = HooksManagerClass.Instance();
