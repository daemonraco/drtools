"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksManager = void 0;
const tslib_1 = require("tslib");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const _1 = require(".");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class TasksManager extends includes_1.GenericManager {
    //
    // Constructor.
    constructor(directories, options = null, configs = null) {
        super(directories, options, configs);
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
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._loaded) {
                this._loaded = true;
                if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.verbose) {
                    console.log(`Loading tasks:`);
                }
                this._items = {};
                if (!this._lastError && this._itemSpecs.length > 0) {
                    for (let item of this._itemSpecs) {
                        try {
                            if ((_b = this._options) === null || _b === void 0 ? void 0 : _b.verbose) {
                                console.log(`${includes_1.TAB}- '${chalk_1.default.green(item.name)}'`);
                            }
                            const task = require(item.path);
                            task.setConfigs(this._configs);
                            this._items[item.name] = task;
                        }
                        catch (err) {
                            console.error(chalk_1.default.red(`Unable to load task '${item.name}'.`), err);
                        }
                    }
                }
                this._valid = !this._lastError;
                yield this.runAtStart();
                this.setIntervals();
            }
            return this.valid();
        });
    }
    tasks() {
        return this._itemSpecs.map((item) => {
            const task = this._items[item.name];
            return {
                description: task.description() || '',
                interval: task.interval(),
                name: task.name(),
                path: item.path,
            };
        });
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    consumeQueue() {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.debug) {
                console.log(chalk_1.default.yellow(`DRTools::TasksManager: Consuming task from queue (queue count: ${this._queue.length})...`));
            }
            if (!this._consumingQueue && this._queue.length > 0) {
                this._consumingQueue = true;
                if ((_b = this._options) === null || _b === void 0 ? void 0 : _b.debug) {
                    console.log(chalk_1.default.yellow(`DRTools::TasksManager: Running task...`));
                }
                const task = this._queue.shift();
                yield task();
                if ((_c = this._options) === null || _c === void 0 ? void 0 : _c.debug) {
                    console.log(chalk_1.default.yellow(`DRTools::TasksManager: Task done (queue count: ${this._queue.length}).`));
                }
                this._consumingQueue = false;
            }
            else if (this._consumingQueue && ((_d = this._options) === null || _d === void 0 ? void 0 : _d.debug)) {
                console.log(chalk_1.default.yellow(`DRTools::TasksManager: A task is already running (queue count: ${this._queue.length}).`));
            }
        });
    }
    /* istanbul ignore next */
    cleanOptions() {
        this._options = Object.assign({ debug: false, queueTick: 5000, runAsQueue: false, suffix: _1.TasksConstants.Suffix, verbose: true }, this._options !== null ? this._options : {});
    }
    /* istanbul ignore next */
    runAtStart() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.valid()) {
                for (const [, task] of Object.entries(this._items)) {
                    if (task.runAtStart()) {
                        yield task.run();
                    }
                }
            }
        });
    }
    /* istanbul ignore next */
    setIntervals() {
        var _a, _b;
        if (this.valid()) {
            for (const [, task] of Object.entries(this._items)) {
                //
                // Are tasks being run when their time comes up?, or when their
                // time comes up are they being queued for the next queue available tick?
                if (!this._options || !this._options.runAsQueue) {
                    this._intervals.push(setInterval(() => {
                        var _a;
                        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.debug) {
                            console.log(chalk_1.default.yellow(`DRTools::TasksManager: Running task '${task.name()}'.`));
                        }
                        task.run();
                    }, task.interval()));
                }
                else {
                    this._intervals.push(setInterval(() => {
                        var _a;
                        this._queue.push(task.run);
                        if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.debug) {
                            console.log(chalk_1.default.yellow(`DRTools::TasksManager: Task '${task.name()}' pushed into queue (queue count: ${this._queue.length}).`));
                        }
                    }, task.interval()));
                }
            }
            //
            // Setting a main interval to consume queued tasks.
            if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.runAsQueue) {
                this._queueInterval = setInterval(() => this.consumeQueue(), ((_b = this._options) === null || _b === void 0 ? void 0 : _b.queueTick) || 5000);
            }
        }
    }
}
exports.TasksManager = TasksManager;
