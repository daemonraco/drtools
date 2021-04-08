"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = exports.ToolsCheckPath = void 0;
const tslib_1 = require("tslib");
/**
 * @file tools.ts
 * @author Alejandro D. Simi
 */
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
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
    constructor() {
    }
    //
    // Public class methods.
    static BlockRetry(block, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            options = Object.assign({ logPrefix: '', maxRetries: 3, params: {} }, options);
            options.logPrefix += !!options.logPrefix ? ' ' : '';
            let done = false;
            let lastException = null;
            let retries = 0;
            while (!done && options && options.maxRetries !== undefined && retries < options.maxRetries) {
                try {
                    yield block(options.params || {});
                    done = true;
                }
                catch (err) {
                    lastException = err;
                    console.error(chalk_1.default.red(`${options.logPrefix}${err}`));
                    yield Tools.Delay();
                    console.error(chalk_1.default.cyan(`${options.logPrefix}retrying...`));
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
            if (right !== undefined) {
                left = right;
            }
        }
        return left;
    }
    static Delay(ms = 1000) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((r) => { setTimeout(r, ms); });
        });
    }
    static FullErrors() {
        return process.env.DRTOOLS_DEBUG !== undefined;
    }
    static FullPath(basicPath) {
        return fs.existsSync(basicPath) ? path.resolve(basicPath) : path.join(process.cwd(), basicPath);
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
    static RandomKey() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '');
    }
    static Version() {
        return require('../../../package.json').version;
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
            result.stat = fs.statSync(filePath);
        }
        catch (e) { }
        if (result.stat) {
            if (typeof result.stat[checker] === 'function') {
                if ((result.stat[checker])()) {
                    result.status = ToolsCheckPath.Ok;
                    result.path = path.resolve(result.path);
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
            result = Tools.CheckPathByType(checker, path.join(relativeTo, filePath), null);
            result.originalPath = aux;
        }
        return result;
    }
}
exports.Tools = Tools;
//
// Private class properties.
Tools._IsBrowser = new Function("try {return this===window;}catch(e){ return false;}");
Tools._IsNode = new Function("try {return this===global;}catch(e){return false;}");
