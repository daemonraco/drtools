"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
class PluginsManager {
    //
    // Constructor.
    constructor(directories, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._directories = [];
        this._itemSpecs = null;
        this._lastError = null;
        this._options = null;
        this._paths = null;
        this._valid = false;
        if (!Array.isArray(directories)) {
            directories = [directories];
        }
        this._directories = directories;
        this._options = options;
        this._configs = configs;
        this.cleanOptions();
        this.checkDirectories();
        this.loadItemPaths();
        this.load();
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerPluginsManager(this);
    }
    //
    // Public methods.
    configNameOf(name) {
        return `${_1.PluginsConstants.ConfigsPrefix}${name}`;
    }
    configOf(name) {
        let results = {};
        if (this._configs) {
            results = this._configs.get(this.configNameOf(name));
        }
        return results;
    }
    configs() {
        return this._configs;
    }
    directories() {
        return this._directories;
    }
    get(code) {
        let results = null;
        const codePieces = code.split('::');
        if (typeof codePieces[1] === 'undefined') {
            codePieces[1] = _1.PluginsConstants.DefaultMethod;
        }
        if (typeof this._itemSpecs[codePieces[0]] !== 'undefined') {
            const specs = this._itemSpecs[codePieces[0]];
            if (typeof specs.library[codePieces[1]] !== 'undefined') {
                results = specs.library[codePieces[1]];
            }
        }
        return results;
    }
    items() {
        return includes_1.Tools.DeepCopy(this._itemSpecs);
    }
    itemNames() {
        return Object.keys(this._itemSpecs);
    }
    lastError() {
        return this._lastError;
    }
    methodsOf(name) {
        return typeof this._itemSpecs[name] !== 'undefined' ? Object.keys(this._itemSpecs[name].library) : [];
    }
    pluginConfig(plgName) {
        let out = null;
        return out;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    checkDirectories() {
        //
        // Checking given directory paths.
        if (!this._lastError) {
            const cleanDirectories = [];
            for (let dir of this._directories) {
                dir = includes_1.Tools.FullPath(dir);
                let stat = null;
                try {
                    stat = libraries_1.fs.statSync(dir);
                }
                catch (e) { }
                if (!stat) {
                    this._lastError = `'${dir}' does not exist.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                }
                else if (!stat.isDirectory()) {
                    this._lastError = `'${dir}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                    break;
                }
                cleanDirectories.push(dir);
            }
            this._directories = cleanDirectories;
        }
    }
    cleanOptions() {
        let defaultOptions = {
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    load() {
        if (!this._lastError) {
            this._itemSpecs = {};
            if (this._options.verbose) {
                console.log(`Loading plugins:`);
            }
            for (const dir of this._paths) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${libraries_1.chalk.green(dir.name)}'`);
                    }
                    global[_1.PluginsConstants.GlobalConfigPointer] = this.configOf(dir.name);
                    let library = require(libraries_1.path.join(dir.path, 'index.js'));
                    delete global[_1.PluginsConstants.GlobalConfigPointer];
                    if (typeof library !== 'object' || Array.isArray(library)) {
                        const aux = library;
                        library = {};
                        library[`${_1.PluginsConstants.DefaultMethod}`] = aux;
                    }
                    this._itemSpecs[dir.name] = { name: dir.name, path: dir.path, library };
                }
                catch (e) {
                    console.error(libraries_1.chalk.red(`Unable to load plugin '${dir.name}'. ${e}`));
                }
            }
        }
    }
    loadItemPaths() {
        if (!this._lastError) {
            this._paths = [];
            for (const dir of this._directories) {
                let dirs = libraries_1.fs.readdirSync(dir)
                    .map(x => {
                    return {
                        name: x,
                        path: includes_1.Tools.FullPath(libraries_1.path.join(dir, x))
                    };
                })
                    .filter(x => {
                    let stat = null;
                    try {
                        stat = libraries_1.fs.statSync(x.path);
                    }
                    catch (e) { }
                    return stat && stat.isDirectory();
                });
                for (const dir of dirs) {
                    this._paths.push(dir);
                }
            }
        }
    }
}
exports.PluginsManager = PluginsManager;
