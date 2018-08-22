/**
 * @file builder.ts
 * @author Alejandro D. Simi
 */
/**
 * @class PromisifyBuilder
 */
export declare class PromisifyBuilder {
    protected constructor();
    static DefaultStrategy(func: Function, parentObject: object): Function;
    static ErrorAndData(func: Function, parentObject: object): Function;
}
