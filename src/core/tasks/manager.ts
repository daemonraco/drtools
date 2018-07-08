/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, ItemSpec, Tools } from '../includes';
import { Task, TasksConstants, TasksList, TasksManagerOptions } from '.';

declare const global: any;

export class TasksManager extends GenericManager<TasksManagerOptions> {
    //
    // Protected properties.
    protected _intervals: any[] = [];
    protected _items: TasksList = null;
    //
    // Constructor.
    constructor(directory: string, options: TasksManagerOptions = null, configs: ConfigsManager = null) {
        super(directory, options, configs);

        this.load();
        this._valid = !this._lastError;

        this.runAtStart();
        this.setIntervals();

        DRCollector.registerTasksManager(this);
    }
    //
    // Public methods.
    public tasks(): any[] {
        return this._itemSpecs.map((item: ItemSpec) => {
            const task: Task = this._items[item.name];
            return {
                name: task.name(),
                description: task.description(),
                interval: task.interval(),
                path: item.path
            }
        });
    }
    //
    // Protected methods.
    protected cleanOptions(): void {
        let defaultOptions: TasksManagerOptions = {
            suffix: TasksConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
    }
    protected load(): void {
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

                    const task: Task = require(this._itemSpecs[i].path);
                    task.setConfigs(this._configs);
                    this._items[this._itemSpecs[i].name] = <Task>task;
                } catch (e) {
                    console.error(chalk.red(`Unable to load task '${this._itemSpecs[i].name}'.\n\t${e}`));
                }
            }
        }
    }
    protected runAtStart(): void {
        if (this.valid()) {
            Object.keys(this._items).forEach((key: string) => {
                const task: Task = this._items[key];
                if (task.runAtStart()) {
                    task.run();
                }
            });
        }
    }
    protected setIntervals(): void {
        if (this.valid()) {
            Object.keys(this._items).forEach((key: string) => {
                const task: Task = this._items[key];
                this._intervals.push(setInterval(task.run, task.interval()));
            });
        }
    }
}
