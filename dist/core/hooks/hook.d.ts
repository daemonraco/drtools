/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
import { EventEmitter } from '../../libraries';
import { BasicDictionary, BasicList } from '../includes';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';
export declare class Hook {
    protected _cache: HookBait;
    protected _chainedCache: HookBait;
    protected _isCached: boolean;
    protected _key: string;
    protected _listeners: HookFunctions<any, any>;
    protected _listenersOrder: BasicDictionary<string>;
    protected _events: EventEmitter;
    constructor(key: string);
    activateCache(): void;
    addListener<B = HookBait, R = any>(key: string, callback: HookRunFunction<B, R>, order?: number): void;
    chainedReelIn<T = HookBait>(bait: T): Promise<T>;
    isCached(): boolean;
    key(): string;
    listenerCodes(): BasicList<string>;
    reelIn<B = HookBait, R = any>(bait: B): Promise<HookResults<R>>;
    removeListener(key: string): void;
    on(event: string, listener: any): void;
    espinel: <B = HookBait, R = any>(bait: B) => Promise<HookResults<R>>;
    matryoshka: <T = HookBait>(bait: T) => Promise<T>;
    protected _cleanOrders(): number[];
    protected _resetCache(): void;
}
