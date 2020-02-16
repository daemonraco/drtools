/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary } from '../includes';
import { Hook } from './hook';

export type HookBait<T = any> = BasicDictionary<T>;

export type HookChainReelInFunction<T = HookBait> = (data: T) => Promise<T>;

export type HookReelInFunction<B = HookBait, R = any> = (data: B) => Promise<HookResults<R>>;

export type HookRunFunction<B = HookBait, R = any> = HookChainReelInFunction<B> | HookReelInFunction<B, R>;

export type HookFunctions<B = HookBait, R = any> = BasicDictionary<HookRunFunction<B, R>>;

export type HookResults<T = any> = BasicDictionary<T>;

export type Hooks = BasicDictionary<Hook>;
