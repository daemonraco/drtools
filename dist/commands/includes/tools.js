"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const tslib_1 = require("tslib");
/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
class Tools {
    //
    // Constructor
    constructor() {
        //
        // Private properties.
        this._loaded = false;
        this._packageData = null;
        this.load();
    }
    //
    // Public methods.
    packageData() {
        return this._packageData;
    }
    version() {
        return this._packageData.version;
    }
    //
    // Private methods.
    load() {
        if (!this._loaded) {
            this._loaded = true;
            this._packageData = require(path.join(__dirname, '../../../package.json'));
        }
    }
    //
    // Public class methods.
    static CompletePath(incompletePath) {
        return fs.existsSync(incompletePath) ? incompletePath : path.join(process.cwd(), incompletePath);
    }
    static Instance() {
        if (!Tools._Instance) {
            Tools._Instance = new Tools();
        }
        return Tools._Instance;
    }
}
exports.Tools = Tools;
//
// Private class properties.
Tools._Instance = null;
