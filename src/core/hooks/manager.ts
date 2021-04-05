/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { BasicList } from '../includes';
import { Hook } from './hook';
import { Hooks } from './types';

class HooksManagerClass {
    //
    // Protected class properties.
    protected static _Instance: HooksManagerClass | null = null;
    //
    // Protected properties.
    protected _hooks: Hooks = {};
    //
    // Constructors.
    constructor() {
    }
    //
    // Public methods.
    public get(key: string): Hook {
        if (this._hooks[key] === undefined) {
            this._hooks[key] = new Hook(key);
        }

        return this._hooks[key];
    }
    public keys(): BasicList<string> {
        return Object.keys(this._hooks);
    }
    //
    // Public class methods.
    public static Instance(): HooksManagerClass {
        if (!HooksManagerClass._Instance) {
            HooksManagerClass._Instance = new HooksManagerClass();
        }

        return HooksManagerClass._Instance;
    }
}

export const HooksManager = HooksManagerClass.Instance();
