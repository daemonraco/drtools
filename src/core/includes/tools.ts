/**
 * @file tools.ts
 * @author Alejandro D. Simi
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export enum ToolsCheckPath {
    Unknown,
    Ok,
    DoesntExist,
    WrongType,
    WrongChecker,
};
export interface IToolsCheckPathResult {
    status: ToolsCheckPath;
    originalPath: string;
    path: string;
    stat: any;
};
export type TBlockRetryFunction = (params: { [key: string]: any }) => Promise<void>;
export interface IBlockRetryOptions {
    logPrefix?: string;
    maxRetries?: number;
    params?: { [key: string]: any };
};

export class Tools {
    //
    // Private class properties.
    private static _IsBrowser: Function = new Function("try {return this===window;}catch(e){ return false;}");
    private static _IsNode: Function = new Function("try {return this===global;}catch(e){return false;}");
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public class methods.
    public static async BlockRetry(block: TBlockRetryFunction, options: IBlockRetryOptions = {}): Promise<void> {
        options = {
            logPrefix: '',
            maxRetries: 3,
            params: {},
            ...options,
        };
        options.logPrefix += !!options.logPrefix ? ' ' : '';

        let done: boolean = false;
        let lastException: any = null;
        let retries: number = 0;

        while (!done && options && options.maxRetries !== undefined && retries < options.maxRetries) {
            try {
                await block(options.params || {});
                done = true;
            } catch (err) {
                lastException = err;
                console.error(chalk.red(`${options.logPrefix}${err}`));

                await Tools.Delay();
                console.error(chalk.cyan(`${options.logPrefix}retrying...`));
            }

            retries++;
        }

        if (!done && lastException) {
            throw lastException;
        }
    }
    public static CheckDirectory(dirPath: string, relativeTo: string | null = null): IToolsCheckPathResult {
        return Tools.CheckPathByType('isDirectory', dirPath, relativeTo);
    }
    public static CheckFile(filePath: string, relativeTo: string | null = null): IToolsCheckPathResult {
        return Tools.CheckPathByType('isFile', filePath, relativeTo);
    }
    /**
     * Takes an object and returns a clone of if. It avoids using the same
     * pointer.
     *
     * @static
     * @method DeepCopy
     * @param {any} obj Object to be copied.
     * @returns {any} Returns a deep copy of the given object.
     */
    public static DeepCopy(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
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
    public static DeepMergeObjects(left: any, right: any): any {
        //
        // If the left item is an array or an object, then have special ways to
        // merge.
        if (Array.isArray(left)) {
            //
            // If both are arrays, the can be concatenated.
            if (Array.isArray(right)) {
                left = left.concat(right);
            }
        } else if (typeof left === 'object' && right !== null) {
            //
            // If both are objects, each properties of the right one have to go
            // into the left one.
            if (typeof right === 'object' && right !== null && !Array.isArray(right)) {
                Object.keys(right).forEach(key => {
                    left[key] = Tools.DeepMergeObjects(left[key], right[key]);
                });
            }
        } else {
            //
            // At this point, if the right one exist, it overwrites the left one.
            if (right !== undefined) {
                left = right;
            }
        }

        return left;
    }
    public static async Delay(ms: number = 1000): Promise<void> {
        return new Promise<void>((r: Function): void => { setTimeout(r, ms) });
    }
    public static FullErrors(): boolean {
        return process.env.DRTOOLS_DEBUG !== undefined;
    }
    public static FullPath(basicPath: string): string {
        return fs.existsSync(basicPath) ? path.resolve(basicPath) : path.join(process.cwd(), basicPath);
    }
    public static IsBrowser(): boolean {
        return Tools._IsBrowser();
    }
    public static IsExpress(app: any): boolean {
        return app.context === undefined;
    }
    public static IsKoa(app: any): boolean {
        return app.context !== undefined;
    }
    public static IsNode(): boolean {
        return Tools._IsNode();
    }
    public static RandomKey(): string {
        return Math.random().toString(36).replace(/[^a-z]+/g, '');
    }
    public static Version(): string {
        return require('../../../package.json').version;
    }
    //
    // Protected class methods.
    protected static CheckPathByType(checker: string, filePath: string, relativeTo: string | null = null): IToolsCheckPathResult {
        let result: IToolsCheckPathResult = {
            status: ToolsCheckPath.Unknown,
            originalPath: filePath,
            path: filePath,
            stat: null
        };

        try { result.stat = fs.statSync(filePath); } catch (e) { }
        if (result.stat) {
            if (typeof result.stat[checker] === 'function') {
                if ((result.stat[checker])()) {
                    result.status = ToolsCheckPath.Ok;
                    result.path = path.resolve(result.path);
                } else {
                    result.status = ToolsCheckPath.WrongType;
                }
            } else {
                result.status = ToolsCheckPath.WrongChecker;
            }
        } else {
            result.status = ToolsCheckPath.DoesntExist;
        }

        if (relativeTo && result.status === ToolsCheckPath.DoesntExist) {
            const aux: string = result.originalPath;
            result = Tools.CheckPathByType(checker, path.join(relativeTo, filePath), null);
            result.originalPath = aux;
        }

        return result;
    }
}