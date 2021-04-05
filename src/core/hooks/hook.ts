/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, BasicList } from '../includes';
import { EventEmitter } from 'events';
import { HookBait, HookFunctions, HookResults, HookRunFunction } from './types';
import { HookConstants, HookEvents } from './constants';

export class Hook {
    //
    // Protected properties.
    protected _cache: HookBait | null = null;
    protected _chainedCache: HookBait | null = null;
    protected _isCached: boolean = false;
    protected _key: string = '';
    protected _listeners: HookFunctions<any, any> = {};
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
    public addListener<B = HookBait, R = any>(key: string, callback: HookRunFunction<B, R>, order: number = HookConstants.DefaultHookOrder): void {
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
        this._events.emit(HookEvents.Hooked, { key });
    }
    public async chainedReelIn<T = HookBait>(bait: T): Promise<T> {
        if (!this.isCached() || this._chainedCache === null) {
            for (const order of this.cleanOrders()) {
                bait = <T>(await this._listeners[this._listenersOrder[order]](bait));
            }

            if (this.isCached()) {
                this._chainedCache = bait;
            }
        } else {
            bait = <T>(this._chainedCache);
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
    public async reelIn<B = HookBait, R = any>(bait: B): Promise<HookResults<R>> {
        let results: HookResults<R> = {};

        if (!this.isCached() || this._cache === null) {
            for (const order of this.cleanOrders()) {
                const key: string = this._listenersOrder[order];
                results[key] = <R>(await this._listeners[key](bait));
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
            this.resetCache();
            this._events.emit(HookEvents.Unhooked, { key });
        }
        for (const order of Object.keys(this._listenersOrder)) {
            if (this._listenersOrder[order] === key) {
                delete this._listenersOrder[order];
            }
        }
    }
    public resetCache(): void {
        this._cache = null;
        this._chainedCache = null;
    }
    public on(event: string, listener: any): void {
        this._events.on(event, listener);
    }
    //
    // Public method aliases.
    public espinel: <B = HookBait, R = any>(bait: B) => Promise<HookResults<R>> = this.reelIn;
    public matryoshka: <T = HookBait>(bait: T) => Promise<T> = this.chainedReelIn;
    //
    // Protected methods.
    /* istanbul ignore next */
    protected cleanOrders(): number[] {
        let result: number[] = [];
        for (const order of Object.keys(this._listenersOrder)) {
            result.push(parseInt(order));
        }

        return result.sort((a, b) => a - b);
    }
}