/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */

import { EventEmitter } from '../../libraries';

import { BasicDictionary, BasicList } from '../includes';
import { HookConstants, HookEvents } from './constants';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';

export class Hook {
    //
    // Protected properties.
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
    public addListener(key: string, callback: HookRunFunction, order: number = HookConstants.DefaultHookOrder): void {
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
        this._events.emit(HookEvents.Hooked, { key });
    }
    public async chainedReelIn(bait: HookBait): Promise<HookBait> {
        for (const order of this.cleanOrders()) {
            bait = await this._listeners[this._listenersOrder[order]](bait);
        }

        return bait;
    }
    public key(): string {
        return this._key;
    }
    public listenerCodes(): BasicList<string> {
        return Object.keys(this._listeners);
    }
    public async reelIn(bait: HookBait): Promise<HookResults> {
        let results: HookResults = {};

        for (const order of this.cleanOrders()) {
            const key: string = this._listenersOrder[order];
            results[key] = await this._listeners[key](bait);
        }

        return results;
    }
    public removeListener(key: string): void {
        if (typeof this._listeners[key] !== 'undefined') {
            delete this._listeners[key];
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
    protected cleanOrders(): number[] {
        let result: number[] = [];
        for (const order of Object.keys(this._listenersOrder)) {
            result.push(parseInt(order));
        }

        return result.sort((a, b) => a - b);
    }
}