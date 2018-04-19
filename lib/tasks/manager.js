"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
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
        this.load();
        this._valid = !this._lastError;
        this.runAtStart();
        this.setIntervals();
    }
    //
    // Public methods.
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
    load() {
        if (this._options.verbose) {
            console.log(`Loading tasks:`);
        }
        this._items = {};
        if (!this._lastError && this._itemSpecs.length > 0) {
            for (let i in this._itemSpecs) {
                try {
                    if (this._options.verbose) {
                        console.log(`\t- '${chalk.green(this._itemSpecs[i].name)}'`);
                    }
                    const task = require(this._itemSpecs[i].path);
                    task.setConfigs(this._configs);
                    this._items[this._itemSpecs[i].name] = task;
                }
                catch (e) {
                    console.error(chalk.red(`Unable to load task '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
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
