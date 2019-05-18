/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
/// <reference types="node" />
import { EventEmitter } from '../../libraries';
import { BasicDictionary, BasicList } from '../includes';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';
export declare class Hook {
    protected _cache: HookBait;
    protected _chainedCache: HookBait;
    protected _isCached: boolean;
    protected _key: string;
    protected _listeners: HookFunctions;
    protected _listenersOrder: BasicDictionary<string>;
    protected _events: EventEmitter;
    constructor(key: string);
    activateCache(): void;
    addListener(key: string, callback: HookRunFunction, order?: number): void;
    chainedReelIn(bait: HookBait): Promise<HookBait>;
    isCached(): boolean;
    key(): string;
    listenerCodes(): BasicList<string>;
    reelIn(bait: HookBait): Promise<HookResults>;
    removeListener(key: string): void;
    on(event: string, listener: any): void;
    espinel: (bait: HookBait) => Promise<HookResults>;
    matryoshka: (bait: HookBait) => Promise<HookBait>;
    protected _cleanOrders(): number[];
    protected _resetCache(): void;
}
