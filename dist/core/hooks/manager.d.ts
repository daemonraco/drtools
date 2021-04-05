/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { BasicList } from '../includes';
import { Hook } from './hook';
import { Hooks } from './types';
declare class HooksManagerClass {
    protected static _Instance: HooksManagerClass | null;
    protected _hooks: Hooks;
    constructor();
    get(key: string): Hook;
    keys(): BasicList<string>;
    static Instance(): HooksManagerClass;
}
export declare const HooksManager: HooksManagerClass;
export {};
