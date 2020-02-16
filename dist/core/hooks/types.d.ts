/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary } from '../includes';
import { Hook } from './hook';
export declare type HookBait<T = any> = BasicDictionary<T>;
export declare type HookChainReelInFunction<T = HookBait> = (data: T) => Promise<T>;
export declare type HookReelInFunction<B = HookBait, R = any> = (data: B) => Promise<HookResults<R>>;
export declare type HookRunFunction<B = HookBait, R = any> = HookChainReelInFunction<B> | HookReelInFunction<B, R>;
export declare type HookFunctions<B = HookBait, R = any> = BasicDictionary<HookRunFunction<B, R>>;
export declare type HookResults<T = any> = BasicDictionary<T>;
export declare type Hooks = BasicDictionary<Hook>;
