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
    constructor(directory, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._directory = null;
        this._itemSpecs = [];
        this._lastError = null;
        this._loaded = false;
        this._options = null;
        this._valid = false;
        this._configs = configs;
        this._options = options;
        this._directory = directory;
        this.cleanOptions();
        this.checkDirectory();
        this.loadItemPaths();
    }
    //
    // Public methods.
    directory() {
        return this._directory;
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
    checkDirectory() {
        //
        // Checking given directory path.
        if (!this._lastError) {
            const check = includes_1.Tools.CheckDirectory(this._directory, process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._directory = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directory}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                default:
                    this._lastError = `'${this._directory}' does not exist.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
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
            const itemsPattern = new RegExp(`^(.*)${suffix}\\.(json|js|ts)$`);
            this._itemSpecs = libraries_1.fs.readdirSync(this._directory)
                .filter((x) => x.match(itemsPattern))
                .map((x) => ({
                name: x.replace(itemsPattern, '$1'),
                path: includes_1.Tools.FullPath(libraries_1.path.join(this._directory, x))
            }));
            this._valid = !this._lastError;
        }
    }
}
exports.GenericManager = GenericManager;
