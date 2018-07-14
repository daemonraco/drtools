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
class TasksManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(directory, options = null, configs = null) {
        super(directory, options, configs);
        //
        // Protected properties.
        this._intervals = [];
        this._items = null;
        this._valid = !this._lastError;
        drcollector_1.DRCollector.registerTasksManager(this);
    }
    //
    // Public methods.
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
                if (this._options.verbose) {
                    console.log(`Loading tasks:`);
                }
                this._items = {};
                if (!this._lastError && this._itemSpecs.length > 0) {
                    for (let item of this._itemSpecs) {
                        try {
                            if (this._options.verbose) {
                                console.log(`\t- '${libraries_1.chalk.green(item.name)}'`);
                            }
                            const task = require(item.path);
                            task.setConfigs(this._configs);
                            this._items[item.name] = task;
                        }
                        catch (e) {
                            console.error(libraries_1.chalk.red(`Unable to load task '${item.name}'.\n\t${e}`));
                        }
                    }
                }
                this._valid = !this._lastError;
                this.runAtStart();
                this.setIntervals();
            }
            return this.valid();
        });
    }
    tasks() {
        return this._itemSpecs.map((item) => {
            const task = this._items[item.name];
            return {
                name: task.name(),
                description: task.description(),
                interval: task.interval(),
                path: item.path
            };
        });
    }
    //
    // Protected methods.
    cleanOptions() {
        let defaultOptions = {
            suffix: _1.TasksConstants.Suffix,
            verbose: true
        };
        this._options = includes_1.Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    runAtStart() {
        if (this.valid()) {
            Object.keys(this._items).forEach((key) => {
                const task = this._items[key];
                if (task.runAtStart()) {
                    task.run();
                }
            });
        }
    }
    setIntervals() {
        if (this.valid()) {
            Object.keys(this._items).forEach((key) => {
                const task = this._items[key];
                this._intervals.push(setInterval(task.run, task.interval()));
            });
        }
    }
}
exports.TasksManager = TasksManager;
