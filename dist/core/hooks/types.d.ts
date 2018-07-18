/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary } from '../includes';
import { Hook } from './hook';
export declare type HookBait = BasicDictionary<any>;
export declare type HookRunFunction = (data: HookBait) => Promise<any>;
export declare type HookFunctions = BasicDictionary<HookRunFunction>;
export declare type HookResults = BasicDictionary<any>;
export declare type Hooks = BasicDictionary<Hook>;
