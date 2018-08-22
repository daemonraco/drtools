/**
 * @file builder.ts
 * @author Alejandro D. Simi
 */
/**
 * @class PromisifyBuilder
 */
export declare class PromisifyBuilder {
    protected static BuildersByType: {
        [key: string]: Function;
    };
    protected constructor();
    static DataAndError(func: Function, parentObject: object): Function;
    static DataAndErrorCallbacks(func: Function, parentObject: object): Function;
    static DefaultStrategy(func: Function, parentObject: object): Function;
    static ErrorAndData(func: Function, parentObject: object): Function;
    static ErrorAndDataCallbacks(func: Function, parentObject: object): Function;
    static Factory(strategy: string, func: Function, parentObject: object): Function;
    protected static FactoryByType(): {
        [key: string]: Function;
    };
}
