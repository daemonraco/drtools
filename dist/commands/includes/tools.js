"use strict";
/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
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
            this._packageData = require(libraries_1.path.join(__dirname, '../../../package.json'));
        }
    }
    //
    // Public class methods.
    static Instance() {
        if (!Tools._Instance) {
            Tools._Instance = new Tools();
        }
        return Tools._Instance;
    }
}
//
// Private class properties.
Tools._Instance = null;
exports.Tools = Tools;
