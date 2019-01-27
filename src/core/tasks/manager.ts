/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { chalk } from '../../libraries';

import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, IItemSpec, Tools } from '../includes';
import { Task, TasksConstants, TasksList, ITasksManagerOptions } from '.';

export class TasksManager extends GenericManager<ITasksManagerOptions> {
    //
    // Protected properties.
    protected _intervals: any[] = [];
    protected _items: TasksList = null;
    //
    // Constructor.
    constructor(directory: string, options: ITasksManagerOptions = null, configs: ConfigsManager = null) {
        super(directory, options, configs);
        this._valid = !this._lastError;

        DRCollector.registerTasksManager(this);
    }
    //
    // Public methods.
    public async load(): Promise<boolean> {
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
                            console.log(`\t- '${chalk.green(item.name)}'`);
                        }

                        const task: Task = require(item.path);
                        task.setConfigs(this._configs);
                        this._items[item.name] = <Task>task;
                    } catch (err) {
                        console.error(chalk.red(`Unable to load task '${item.name}'.`), err);
                    }
                }
            }

            this._valid = !this._lastError;

            this.runAtStart();
            this.setIntervals();
        }

        return this.valid();
    }
    public tasks(): any[] {
        return this._itemSpecs.map((item: IItemSpec) => {
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
        let defaultOptions: ITasksManagerOptions = {
            suffix: TasksConstants.Suffix,
            verbose: true
        };

        this._options = Tools.DeepMergeObjects(defaultOptions, this._options !== null ? this._options : {});
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
