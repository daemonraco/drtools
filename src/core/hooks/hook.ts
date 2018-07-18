/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */

import { EventEmitter } from '../../libraries';

import { BasicList } from '../includes';
import { HookEvents } from './constants';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';

export class Hook {
    //
    // Protected properties.
    protected _key: string = null;
    protected _listeners: HookFunctions = {};
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
    public addListener(key: string, callback: HookRunFunction): void {
        this._listeners[key] = callback;
        this._events.emit(HookEvents.Hooked, { key });
    }
    public key(): string {
        return this._key;
    }
    public listenerCodes(): BasicList<string> {
        return Object.keys(this._listeners);
    }
    public async reelIn(bait: HookBait): Promise<HookResults> {
        let results: HookResults = {};

        for (const key of Object.keys(this._listeners)) {
            results[key] = await this._listeners[key](bait);
        }

        return results;
    }
    public removeListener(key: string): void {
        if (typeof this._listeners[key] !== 'undefined') {
            delete this._listeners[key];
            this._events.emit(HookEvents.Unhooked, { key });
        }
    }
    public on(event: string, listener: any): void {
        this._events.on(event, listener);
    }
}