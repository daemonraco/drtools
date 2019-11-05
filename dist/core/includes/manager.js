"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const includes_1 = require("../includes");
class GenericManager {
    //
    // Constructor.
    constructor(directories, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._directories = [];
        this._itemSpecs = [];
        this._lastError = null;
        this._loaded = false;
        this._options = null;
        this._valid = false;
        this._configs = configs;
        this._options = options;
        this._directories = Array.isArray(directories) ? directories : [directories];
        this.cleanOptions();
        this.checkDirectories();
        this.loadItemPaths();
    }
    //
    // Public methods.
    directories() {
        return this._directories;
    }
    /** @deprecated */
    directory() {
        return this._directories[0];
    }
    items() {
        return includes_1.Tools.DeepCopy(this._itemSpecs);
    }
    itemNames() {
        return this._itemSpecs.map(i => i.name);
    }
    lastError() {
        return this._lastError;
    }
    loaded() {
        return this._loaded;
    }
    matchesKey(key) {
        return this.directory() === key;
    }
    suffix() {
        return this._options.suffix !== undefined ? this._options.suffix : '';
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    checkDirectories() {
        //
        // Checking given directory path.
        if (!this._lastError) {
            for (const index in this._directories) {
                const check = includes_1.Tools.CheckDirectory(this._directories[index], process.cwd());
                switch (check.status) {
                    case includes_1.ToolsCheckPath.Ok:
                        this._directories[index] = check.path;
                        break;
                    case includes_1.ToolsCheckPath.WrongType:
                        this._lastError = `'${this._directories[index]}' is not a directory.`;
                        console.error(libraries_1.chalk.red(this._lastError));
                        break;
                    default:
                        this._lastError = `'${this._directories[index]}' does not exist.`;
                        console.error(libraries_1.chalk.red(this._lastError));
                        break;
                }
                if (this._lastError) {
                    break;
                }
            }
            this._valid = !this._lastError;
        }
    }
    loadItemPaths() {
        if (!this._lastError) {
            this._itemSpecs = [];
            //
            // Basic patterns.
            let suffix = this.suffix();
            suffix = suffix ? `\\.${suffix}` : '';
            const itemsPattern = new RegExp(`^(.*)/(.*)${suffix}\.(json|js|ts)$`);
            for (const directory of this._directories) {
                let paths = libraries_1.glob.sync(libraries_1.path.join(directory, `*${suffix}.*`), { absolute: true });
                this._itemSpecs = [
                    ...this._itemSpecs,
                    ...paths
                        .filter((x) => x.match(itemsPattern))
                        .map((x) => ({
                        name: x.replace(itemsPattern, '$2'),
                        path: x,
                    })),
                ];
            }
            this._valid = !this._lastError;
        }
    }
}
exports.GenericManager = GenericManager;
