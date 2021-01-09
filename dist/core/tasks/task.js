"use strict";
/**
 * @file task.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
class Task {
    //
    // Constructor.
    constructor() {
        //
        // Protected properties.
        this._configs = null;
        this._interval = 5000;
        this._runAtStart = false;
        this.load();
    }
    //
    // Public methods.
    description() {
        return null;
    }
    interval() {
        return this._interval;
    }
    name() {
        throw `Subclass responsibility`;
    }
    run() {
        throw `Subclass responsibility`;
    }
    runAtStart() {
        return this._runAtStart;
    }
    setConfigs(configs) {
        this._configs = configs;
    }
    //
    // Protected methods.
    load() {
        throw `Subclass responsibility`;
    }
}
exports.Task = Task;
