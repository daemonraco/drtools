/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
/// <reference types="node" />
import { EventEmitter } from '../../libraries';
import { BasicDictionary, BasicList } from '../includes';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';
export declare class Hook {
    protected _key: string;
    protected _listeners: HookFunctions;
    protected _listenersOrder: BasicDictionary<string>;
    protected _events: EventEmitter;
    constructor(key: string);
    addListener(key: string, callback: HookRunFunction, order?: number): void;
    chainedReelIn(bait: HookBait): Promise<HookBait>;
    key(): string;
    listenerCodes(): BasicList<string>;
    reelIn(bait: HookBait): Promise<HookResults>;
    removeListener(key: string): void;
    on(event: string, listener: any): void;
    espinel: (bait: HookBait) => Promise<HookResults>;
    matryoshka: (bait: HookBait) => Promise<HookBait>;
    protected cleanOrders(): number[];
}
