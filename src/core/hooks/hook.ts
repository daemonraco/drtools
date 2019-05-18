/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */

import { EventEmitter } from '../../libraries';

import { BasicDictionary, BasicList } from '../includes';
import { HookConstants, HookEvents } from './constants';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';

declare const Promise: any;

export class Hook {
    //
    // Protected properties.
    protected _cache: HookBait = null;
    protected _chainedCache: HookBait = null;
    protected _isCached: boolean = false;
    protected _key: string = null;
    protected _listeners: HookFunctions = {};
    protected _listenersOrder: BasicDictionary<string> = {};
    //
    // Events.
    protected _events: EventEmitter = new EventEmitter();
    //
    // Constructors.
    constructor(key: string) {
        this._key = key;
    }
    //
    // Public methods.
    public activateCache(): void {
        this._isCached = true;
    }
    public addListener(key: string, callback: HookRunFunction, order: number = HookConstants.DefaultHookOrder): void {
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
        this._resetCache();
        //
        // Telling everyone about it (A.K.A. 'bragging' ^__^).
        this._events.emit(HookEvents.Hooked, { key });
    }
    public async chainedReelIn(bait: HookBait): Promise<HookBait> {
        if (!this.isCached() || this._chainedCache === null) {
            for (const order of this._cleanOrders()) {
                bait = await this._listeners[this._listenersOrder[order]](bait);
            }

            if (this.isCached()) {
                this._chainedCache = bait;
            }
        } else {
            bait = this._chainedCache;
        }

        return bait;
    }
    public isCached(): boolean {
        return this._isCached;
    }
    public key(): string {
        return this._key;
    }
    public listenerCodes(): BasicList<string> {
        return Object.keys(this._listeners);
    }
    public async reelIn(bait: HookBait): Promise<HookResults> {
        let results: HookResults = {};

        if (!this.isCached() || this._cache === null) {
            for (const order of this._cleanOrders()) {
                const key: string = this._listenersOrder[order];
                results[key] = await this._listeners[key](bait);
            }

            if (this.isCached()) {
                this._cache = results;
            }
        } else {
            results = this._cache;
        }

        return results;
    }
    public removeListener(key: string): void {
        if (this._listeners[key] !== undefined) {
            delete this._listeners[key];
            this._resetCache();
            this._events.emit(HookEvents.Unhooked, { key });
        }
        for (const order of Object.keys(this._listenersOrder)) {
            if (this._listenersOrder[order] === key) {
                delete this._listenersOrder[order];
            }
        }
    }
    public on(event: string, listener: any): void {
        this._events.on(event, listener);
    }
    //
    // Public method aliases.
    public espinel: (bait: HookBait) => Promise<HookResults> = this.reelIn;
    public matryoshka: (bait: HookBait) => Promise<HookBait> = this.chainedReelIn;
    //
    // Protected methods.
    protected _cleanOrders(): number[] {
        let result: number[] = [];
        for (const order of Object.keys(this._listenersOrder)) {
            result.push(parseInt(order));
        }

        return result.sort((a, b) => a - b);
    }
    protected _resetCache(): void {
        this._cache = null;
        this._chainedCache = null;
    }
}