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
        this._consumingQueue = false;
        this._intervals = [];
        this._items = null;
        this._queue = [];
        this._queueInterval = null;
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
                        catch (err) {
                            console.error(libraries_1.chalk.red(`Unable to load task '${item.name}'.`), err);
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
                path: item.path,
            };
        });
    }
    //
    // Protected methods.
    consumeQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._options.debug) {
                console.log(libraries_1.chalk.yellow(`DRTools::TasksManager: Consuming task from queue (queue count: ${this._queue.length})...`));
            }
            if (!this._consumingQueue && this._queue.length > 0) {
                this._consumingQueue = true;
                if (this._options.debug) {
                    console.log(libraries_1.chalk.yellow(`DRTools::TasksManager: Running task...`));
                }
                const task = this._queue.shift();
                yield task();
                if (this._options.debug) {
                    console.log(libraries_1.chalk.yellow(`DRTools::TasksManager: Task done (queue count: ${this._queue.length}).`));
                }
                this._consumingQueue = false;
            }
            else if (this._consumingQueue && this._options.debug) {
                console.log(libraries_1.chalk.yellow(`DRTools::TasksManager: A task is already running (queue count: ${this._queue.length}).`));
            }
        });
    }
    cleanOptions() {
        this._options = Object.assign({ debug: false, queueTick: 5000, runAsQueue: false, suffix: _1.TasksConstants.Suffix, verbose: true }, this._options !== null ? this._options : {});
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
            for (const key of Object.keys(this._items)) {
                const task = this._items[key];
                //
                // Are tasks being run when their time comes up?, or when their
                // time comes up are they being queued for the next queue available tick?
                if (!this._options.runAsQueue) {
                    this._intervals.push(setInterval(() => {
                        if (this._options.debug) {
                            console.log(libraries_1.chalk.yellow(`DRTools::TasksManager: Running task '${task.name()}'.`));
                        }
                        task.run();
                    }, task.interval()));
                }
                else {
                    this._intervals.push(setInterval(() => {
                        this._queue.push(task.run);
                        if (this._options.debug) {
                            console.log(libraries_1.chalk.yellow(`DRTools::TasksManager: Task '${task.name()}' pushed into queue (queue count: ${this._queue.length}).`));
                        }
                    }, task.interval()));
                }
            }
            //
            // Setting a main interval to consume queued tasks.
            if (this._options.runAsQueue) {
                this._queueInterval = setInterval(() => this.consumeQueue(), this._options.queueTick);
            }
        }
    }
}
exports.TasksManager = TasksManager;
