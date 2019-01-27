"use strict";
/**
 * @file manager.ts
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
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
class PluginsManager {
    //
    // Constructor.
    constructor(directory, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._directory = null;
        this._itemSpecs = null;
        this._lastError = null;
        this._loaded = false;
        this._options = null;
        this._paths = null;
        this._valid = false;
        this._directory = directory;
        this._options = options;
        this._configs = configs;
        this.cleanOptions();
        this.checkDirectory();
        this.loadItemPaths();
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
    directory() {
        return this._directory;
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
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
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
                            let prom = null;
                            switch (typeof library[`${_1.PluginsConstants.InitializationMethod}`]) {
                                case 'function':
                                    prom = library[`${_1.PluginsConstants.InitializationMethod}`]();
                                    break;
                                case 'object':
                                    prom = library[`${_1.PluginsConstants.InitializationMethod}`];
                                    break;
                            }
                            if (prom && prom instanceof Promise) {
                                yield prom;
                            }
                            this._itemSpecs[dir.name] = { name: dir.name, path: dir.path, library };
                        }
                        catch (err) {
                            console.error(libraries_1.chalk.red(`Unable to load plugin '${dir.name}'.`), err);
                        }
                    }
                }
                this._valid = !this._lastError;
            }
            return this.valid();
        });
    }
    loaded() {
        return this._loaded;
    }
    matchesKey(key) {
        return this.directory() === key;
    }
    methodsOf(name) {
        return typeof this._itemSpecs[name] !== 'undefined' ? Object.keys(this._itemSpecs[name].library) : [];
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    checkDirectory() {
        //
        // Checking given directory paths.
        if (!this._lastError) {
            const check = includes_1.Tools.CheckDirectory(this._directory, process.cwd());
            switch (check.status) {
                case includes_1.ToolsCheckPath.Ok:
                    this._directory = check.path;
                    break;
                case includes_1.ToolsCheckPath.WrongType:
                    this._lastError = `'${this._directory}' is not a directory.`;
                    console.error(libraries_1.chalk.red(this._lastError));
                default:
                    this._lastError = `'${this._directory}' does not exist.`;
                    console.error(libraries_1.chalk.red(this._lastError));
            }
        }
    }
    cleanOptions() {
        let defaultOptions = {
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    loadItemPaths() {
        if (!this._lastError) {
            this._paths = [];
            let dirs = libraries_1.fs.readdirSync(this._directory)
                .map(x => {
                return {
                    name: x,
                    path: includes_1.Tools.FullPath(libraries_1.path.join(this._directory, x))
                };
            })
                .filter(x => {
                const check = includes_1.Tools.CheckDirectory(x.path);
                return check.status === includes_1.ToolsCheckPath.Ok;
            });
            for (const dir of dirs) {
                this._paths.push(dir);
            }
        }
    }
}
exports.PluginsManager = PluginsManager;
