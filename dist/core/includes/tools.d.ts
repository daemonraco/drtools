export declare enum ToolsCheckPath {
    Unknown = 0,
    Ok = 1,
    DoesntExist = 2,
    WrongType = 3,
    WrongChecker = 4
}
export interface IToolsCheckPathResult {
    status: ToolsCheckPath;
    originalPath: string;
    path: string;
    stat: any;
}
export declare type TBlockRetryFunction = (params: {
    [key: string]: any;
}) => Promise<void>;
export interface IBlockRetryOptions {
    logPrefix?: string;
    maxRetries?: number;
    params?: {
        [key: string]: any;
    };
}
export declare class Tools {
    private static _IsBrowser;
    private static _IsNode;
    private constructor();
    static BlockRetry(block: TBlockRetryFunction, options?: IBlockRetryOptions): Promise<void>;
    static CheckDirectory(dirPath: string, relativeTo?: string | null): IToolsCheckPathResult;
    static CheckFile(filePath: string, relativeTo?: string | null): IToolsCheckPathResult;
    /**
     * Takes an object and returns a clone of if. It avoids using the same
     * pointer.
     *
     * @static
     * @method DeepCopy
     * @param {any} obj Object to be copied.
     * @returns {any} Returns a deep copy of the given object.
     */
    static DeepCopy(obj: any): any;
    /**
     * This method takes two things that can be objects, arrays or simple values
     * and tries the deep-merge the second one into the first one.
     *
     * @static
     * @method DeepMergeObjects
     * @param {any} left Object to merge into.
     * @param {any} right Object from which take stuff to merge into the other
     * one.
     * @returns {any} Returns a merged object.
     */
    static DeepMergeObjects(left: any, right: any): any;
    static Delay(ms?: number): Promise<void>;
    static FullErrors(): boolean;
    static FullPath(basicPath: string): string;
    static IsBrowser(): boolean;
    static IsExpress(app: any): boolean;
    static IsKoa(app: any): boolean;
    static IsNode(): boolean;
    static RandomKey(): string;
    static Version(): string;
    protected static CheckPathByType(checker: string, filePath: string, relativeTo?: string | null): IToolsCheckPathResult;
}
