/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary } from '../includes';
import { Hook } from './hook';

export type HookBait = BasicDictionary<any>;

export type HookRunFunction = (data: HookBait) => Promise<any>;

export type HookFunctions = BasicDictionary<HookRunFunction>;

export type HookResults = BasicDictionary<any>;

export type Hooks = BasicDictionary<Hook>;
