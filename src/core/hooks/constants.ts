/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */

export  class HookConstants {
    public static readonly DefaultHookOrder:number = 1000;

    private constructor() { }
}

export class HookEvents {
    public static readonly Hooked: string = 'hooked';
    public static readonly Unhooked: string = 'unhooked';

    private constructor() { }
}