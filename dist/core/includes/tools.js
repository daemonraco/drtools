"use strict";
/**
 * @file tools.ts
 * @author Alejandro D. Simi
 */
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
class Tools {
    //
    // Constructor.
    constructor() { }
    //
    // Public class methods.
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
    static FullErrors() {
        return typeof process.env.DRTOOLS_DEBUG !== 'undefined';
    }
    static FullPath(basicPath) {
        return libraries_1.fs.existsSync(basicPath) ? libraries_1.path.resolve(basicPath) : libraries_1.path.join(process.cwd(), basicPath);
    }
    static IsBrowser() {
        return Tools._IsBrowser();
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
