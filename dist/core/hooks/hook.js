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
        this._listenersOrder = {};
        //
        // Events.
        this._events = new libraries_1.EventEmitter();
        //
        // Public method aliases.
        this.espinel = this.reelIn;
        this.matryoshka = this.chainedReelIn;
        this._key = key;
    }
    //
    // Public methods.
    addListener(key, callback, order = constants_1.HookConstants.DefaultHookOrder) {
        //
        // Is it duplicated?
        //      if it is, it's ignored.
        if (typeof this._listeners[key] === 'undefined') {
            //
            // Finding the proper unique order.
            while (typeof this._listenersOrder[order] !== 'undefined') {
                order++;
            }
            this._listenersOrder[order] = key;
        }
        //
        // Registering listener callback.
        this._listeners[key] = callback;
        //
        // Telling everyone about it (A.K.A. 'bragging' ^__^).
        this._events.emit(constants_1.HookEvents.Hooked, { key });
    }
    chainedReelIn(bait) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const order of this.cleanOrders()) {
                bait = yield this._listeners[this._listenersOrder[order]](bait);
            }
            return bait;
        });
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
            for (const order of this.cleanOrders()) {
                const key = this._listenersOrder[order];
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
        for (const order of Object.keys(this._listenersOrder)) {
            if (this._listenersOrder[order] === key) {
                delete this._listenersOrder[order];
            }
        }
    }
    on(event, listener) {
        this._events.on(event, listener);
    }
    //
    // Protected methods.
    cleanOrders() {
        let result = [];
        for (const order of Object.keys(this._listenersOrder)) {
            result.push(parseInt(order));
        }
        return result.sort((a, b) => a - b);
    }
}
exports.Hook = Hook;
