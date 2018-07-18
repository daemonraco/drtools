"use strict";
/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const constants_1 = require("./constants");
class Hook {
    //
    // Constructors.
    constructor(key) {
        //
        // Protected properties.
        this._key = null;
        this._listeners = {};
        //
        // Events.
        this._events = new libraries_1.EventEmitter();
        this._key = key;
    }
    //
    // Public methods.
    addListener(key, callback) {
        this._listeners[key] = callback;
        this._events.emit(constants_1.HookEvents.Hooked, { key });
    }
    key() {
        return this._key;
    }
    listenerCodes() {
        return Object.keys(this._listeners);
    }
    reelIn(bait) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = {};
            for (const key of Object.keys(this._listeners)) {
                results[key] = yield this._listeners[key](bait);
            }
            return results;
        });
    }
    removeListener(key) {
        if (typeof this._listeners[key] !== 'undefined') {
            delete this._listeners[key];
            this._events.emit(constants_1.HookEvents.Unhooked, { key });
        }
    }
    on(event, listener) {
        this._events.on(event, listener);
    }
}
exports.Hook = Hook;
