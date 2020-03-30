"use strict";
/**
 * @file tools.ts
 * @author Alejandro D. Simi
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
var ToolsCheckPath;
(function (ToolsCheckPath) {
    ToolsCheckPath[ToolsCheckPath["Unknown"] = 0] = "Unknown";
    ToolsCheckPath[ToolsCheckPath["Ok"] = 1] = "Ok";
    ToolsCheckPath[ToolsCheckPath["DoesntExist"] = 2] = "DoesntExist";
    ToolsCheckPath[ToolsCheckPath["WrongType"] = 3] = "WrongType";
    ToolsCheckPath[ToolsCheckPath["WrongChecker"] = 4] = "WrongChecker";
})(ToolsCheckPath = exports.ToolsCheckPath || (exports.ToolsCheckPath = {}));
;
;
;
class Tools {
    //
    // Constructor.
    constructor() { }
    //
    // Public class methods.
    static BlockRetry(block, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({ logPrefix: '', maxRetries: 3, params: {} }, options);
            options.logPrefix += !!options.logPrefix ? ' ' : '';
            let done = false;
            let lastException = null;
            let retries = 0;
            while (!done && retries < options.maxRetries) {
                try {
                    yield block(options.params);
                    done = true;
                }
                catch (err) {
                    lastException = err;
                    console.error(libraries_1.chalk.red(`${options.logPrefix}${err}`));
                    yield Tools.Delay();
                    console.error(libraries_1.chalk.cyan(`${options.logPrefix}retrying...`));
                }
                retries++;
            }
            if (!done && lastException) {
                throw lastException;
            }
        });
    }
    static CheckDirectory(dirPath, relativeTo = null) {
        return Tools.CheckPathByType('isDirectory', dirPath, relativeTo);
    }
    static CheckFile(filePath, relativeTo = null) {
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
    static DeepCopy(obj) {
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
    static DeepMergeObjects(left, right) {
        //
        // If the left item is an array or an object, then have special ways to
        // merge.
        if (Array.isArray(left)) {
            //
            // If both are arrays, the can be concatenated.
            if (Array.isArray(right)) {
                left = left.concat(right);
            }
        }
        else if (typeof left === 'object' && right !== null) {
            //
            // If both are objects, each properties of the right one have to go
            // into the left one.
            if (typeof right === 'object' && right !== null && !Array.isArray(right)) {
                Object.keys(right).forEach(key => {
                    left[key] = Tools.DeepMergeObjects(left[key], right[key]);
                });
            }
        }
        else {
            //
            // At this point, if the right one exist, it overwrites the left one.
            if (typeof right !== 'undefined') {
                left = right;
            }
        }
        return left;
    }
    static Delay(ms = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((r) => { setTimeout(r, ms); });
        });
    }
    static FullErrors() {
        return typeof process.env.DRTOOLS_DEBUG !== 'undefined';
    }
    static FullPath(basicPath) {
        return libraries_1.fs.existsSync(basicPath) ? libraries_1.path.resolve(basicPath) : libraries_1.path.join(process.cwd(), basicPath);
    }
    static IsBrowser() {
        return Tools._IsBrowser();
    }
    static IsExpress(app) {
        return app.context === undefined;
    }
    static IsKoa(app) {
        return app.context !== undefined;
    }
    static IsNode() {
        return Tools._IsNode();
    }
    //
    // Protected class methods.
    static CheckPathByType(checker, filePath, relativeTo = null) {
        let result = {
            status: ToolsCheckPath.Unknown,
            originalPath: filePath,
            path: filePath,
            stat: null
        };
        try {
            result.stat = libraries_1.fs.statSync(filePath);
        }
        catch (e) { }
        if (result.stat) {
            if (typeof result.stat[checker] === 'function') {
                if ((result.stat[checker])()) {
                    result.status = ToolsCheckPath.Ok;
                    result.path = libraries_1.path.resolve(result.path);
                }
                else {
                    result.status = ToolsCheckPath.WrongType;
                }
            }
            else {
                result.status = ToolsCheckPath.WrongChecker;
            }
        }
        else {
            result.status = ToolsCheckPath.DoesntExist;
        }
        if (relativeTo && result.status === ToolsCheckPath.DoesntExist) {
            const aux = result.originalPath;
            result = Tools.CheckPathByType(checker, libraries_1.path.join(relativeTo, filePath), null);
            result.originalPath = aux;
        }
        return result;
    }
}
//
// Private class properties.
Tools._IsBrowser = new Function("try {return this===window;}catch(e){ return false;}");
Tools._IsNode = new Function("try {return this===global;}catch(e){return false;}");
exports.Tools = Tools;
