"use strict";
/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
const libraries_1 = require("../../libraries");
const constants_1 = require("./constants");
class Hook {
    //
    // Constructors.
    constructor(key) {
        //
        // Protected properties.
        this._cache = null;
        this._chainedCache = null;
        this._isCached = false;
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
    activateCache() {
        this._isCached = true;
    }
    addListener(key, callback, order = constants_1.HookConstants.DefaultHookOrder) {
        //
        // Is it duplicated?
        //      if it is, it's ignored.
        if (this._listeners[key] === undefined) {
            //
            // Finding the proper unique order.
            while (this._listenersOrder[order] !== undefined) {
                order++;
            }
            this._listenersOrder[order] = key;
        }
        //
        // Registering listener callback.
        this._listeners[key] = callback;
        //
        // Clearing cache.
        this.resetCache();
        //
        // Telling everyone about it (A.K.A. 'bragging' ^__^).
        this._events.emit(constants_1.HookEvents.Hooked, { key });
    }
    async chainedReelIn(bait) {
        if (!this.isCached() || this._chainedCache === null) {
            for (const order of this.cleanOrders()) {
                bait = (await this._listeners[this._listenersOrder[order]](bait));
            }
            if (this.isCached()) {
                this._chainedCache = bait;
            }
        }
        else {
            bait = (this._chainedCache);
        }
        return bait;
    }
    isCached() {
        return this._isCached;
    }
    key() {
        return this._key;
    }
    listenerCodes() {
        return Object.keys(this._listeners);
    }
    async reelIn(bait) {
        let results = {};
        if (!this.isCached() || this._cache === null) {
            for (const order of this.cleanOrders()) {
                const key = this._listenersOrder[order];
                results[key] = (await this._listeners[key](bait));
            }
            if (this.isCached()) {
                this._cache = results;
            }
        }
        else {
            results = this._cache;
        }
        return results;
    }
    removeListener(key) {
        if (this._listeners[key] !== undefined) {
            delete this._listeners[key];
            this.resetCache();
            this._events.emit(constants_1.HookEvents.Unhooked, { key });
        }
        for (const order of Object.keys(this._listenersOrder)) {
            if (this._listenersOrder[order] === key) {
                delete this._listenersOrder[order];
            }
        }
    }
    resetCache() {
        this._cache = null;
        this._chainedCache = null;
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
