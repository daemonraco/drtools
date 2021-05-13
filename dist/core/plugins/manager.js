"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginsManager = void 0;
const tslib_1 = require("tslib");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class PluginsManager {
    //
    // Constructor.
    constructor(directory, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._directories = [];
        this._itemSpecs = null;
        this._lastError = null;
        this._loaded = false;
        this._options = null;
        this._paths = [];
        this._valid = false;
        this._directories = Array.isArray(directory) ? directory : [directory];
        this._options = options;
        this._configs = configs;
        this.cleanOptions();
        this.checkDirectories();
        this.loadItemPaths();
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerPluginsManager(this);
    }
    //
    // Public methods.
    configNameOf(name) {
        var _a;
        return `${((_a = this._options) === null || _a === void 0 ? void 0 : _a.configsPrefix) || _1.PluginsConstants.ConfigsPrefix}${name}`;
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
    /** @deprecated */
    directory() {
        return this._directories[0];
    }
    directories() {
        return this._directories;
    }
    get(code) {
        let results = null;
        const codePieces = code.split('::');
        if (codePieces[1] === undefined) {
            codePieces[1] = _1.PluginsConstants.DefaultMethod;
        }
        if (this._itemSpecs && this._itemSpecs[codePieces[0]] !== undefined) {
            const specs = this._itemSpecs[codePieces[0]];
            if (specs.library[codePieces[1]] !== undefined) {
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
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
                if (!this._lastError) {
                    this._itemSpecs = {};
                    if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
                        console.log(`Loading plugins:`);
                    }
                    for (const dir of this._paths) {
                        try {
                            if ((_b = this._options) === null || _b === void 0 ? void 0 : _b.verbose) {
                                console.log(`${includes_1.TAB}- '${chalk_1.default.green(dir.name)}'`);
                            }
                            //
                            // Should it consider a distribution folder?
                            if ((_c = this._options) === null || _c === void 0 ? void 0 : _c.dist) {
                                const distPath = path.join(dir.path, ((_d = this._options) === null || _d === void 0 ? void 0 : _d.distPath) || 'dist');
                                let stat = null;
                                try {
                                    stat = yield fs.stat(distPath);
                                }
                                catch (e) { }
                                if (stat && stat.isDirectory()) {
                                    dir.path = distPath;
                                }
                            }
                            global[_1.PluginsConstants.GlobalConfigPointer] = this.configOf(dir.name);
                            let library = require(path.join(dir.path, 'index'));
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
                            console.error(chalk_1.default.red(`Unable to load plugin '${dir.name}'.`), err);
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
        return this._itemSpecs && this._itemSpecs[name] !== undefined ? Object.keys(this._itemSpecs[name].library) : [];
    }
    options() {
        return this._options;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    checkDirectories() {
        //
        // Checking given directory paths.
        if (!this._lastError) {
            for (const index in this._directories) {
                const check = includes_1.Tools.CheckDirectory(this._directories[index], process.cwd());
                switch (check.status) {
                    case includes_1.ToolsCheckPath.Ok:
                        this._directories[index] = check.path;
                        break;
                    case includes_1.ToolsCheckPath.WrongType:
                        this._lastError = `'${this._directories[index]}' is not a directory.`;
                        console.error(chalk_1.default.red(this._lastError));
                    default:
                        this._lastError = `'${this._directories[index]}' does not exist.`;
                        console.error(chalk_1.default.red(this._lastError));
                }
                if (this._lastError) {
                    break;
                }
            }
        }
    }
    /* istanbul ignore next */
    cleanOptions() {
        let defaultOptions = {
            configsPrefix: _1.PluginsConstants.ConfigsPrefix,
            dist: false,
            distPath: 'dist',
            verbose: true,
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    /* istanbul ignore next */
    loadItemPaths() {
        if (!this._lastError) {
            this._paths = [];
            for (const directory of this._directories) {
                let dirs = fs.readdirSync(directory).map((x) => ({
                    name: x,
                    path: includes_1.Tools.FullPath(path.join(directory, x))
                })).filter((x) => {
                    const check = includes_1.Tools.CheckDirectory(x.path);
                    return check.status === includes_1.ToolsCheckPath.Ok;
                });
                for (const dir of dirs) {
                    this._paths.push(dir);
                }
            }
        }
    }
}
exports.PluginsManager = PluginsManager;
