/**
 * @file hook.ts
 * @author Alejandro D. Simi
 */
/// <reference types="node" />
import { EventEmitter } from '../../libraries';
import { BasicList } from '../includes';
import { HookBait, HookRunFunction, HookFunctions, HookResults } from './types';
export declare class Hook {
    protected _key: string;
    protected _listeners: HookFunctions;
    protected _events: EventEmitter;
    constructor(key: string);
    addListener(key: string, callback: HookRunFunction): void;
    key(): string;
    listenerCodes(): BasicList<string>;
    reelIn(bait: HookBait): Promise<HookResults>;
    removeListener(key: string): void;
    on(event: string, listener: any): void;
}
