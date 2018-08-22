/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */

/**
 * @class PromisifyStrategies
 */
export class PromisifyStrategies {
    public static readonly DataAndError: string = 'data-and-error';
    public static readonly DataAndErrorCallbacks: string = 'data-and-error-callbacks';
    public static readonly Default: string = 'default';
    public static readonly ErrorAndData: string = 'error-and-data';
    public static readonly ErrorAndDataCallbacks: string = 'error-and-data-callbacks';

    private constructor() { }
}