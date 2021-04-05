/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { GenericManager, IItemSpec } from '../includes';
import { ITasksManagerOptions, ITasksManager_TasksResponse, Task, TasksConstants, TasksList } from '.';
import chalk from 'chalk';

export class TasksManager extends GenericManager<ITasksManagerOptions> {
    //
    // Protected properties.
    protected _consumingQueue: boolean = false;
    protected _intervals: any[] = [];
    protected _items: TasksList | null = null;
    protected _queue: any[] = [];
    protected _queueInterval: any = null;
    //
    // Constructor.
    constructor(directory: string, options: ITasksManagerOptions | null = null, configs: ConfigsManager | null = null) {
        super(directory, options, configs);
        this._valid = !this._lastError;

        DRCollector.registerTasksManager(this);
    }
    //
    // Public methods.
    public async load(): Promise<boolean> {
        if (!this._loaded) {
            this._loaded = true;

            if (this._options?.verbose) {
                console.log(`Loading tasks:`);
            }

            this._items = {};
            if (!this._lastError && this._itemSpecs.length > 0) {
                for (let item of this._itemSpecs) {
                    try {
                        if (this._options?.verbose) {
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
    public tasks(): ITasksManager_TasksResponse[] {
        return this._itemSpecs.map((item: IItemSpec): ITasksManager_TasksResponse => {
            const task: Task = (<TasksList>this._items)[item.name];
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
    protected async consumeQueue(): Promise<void> {
        if (this._options?.debug) {
            console.log(chalk.yellow(`DRTools::TasksManager: Consuming task from queue (queue count: ${this._queue.length})...`));
        }

        if (!this._consumingQueue && this._queue.length > 0) {
            this._consumingQueue = true;

            if (this._options?.debug) {
                console.log(chalk.yellow(`DRTools::TasksManager: Running task...`));
            }

            const task: Function = this._queue.shift();
            await task();

            if (this._options?.debug) {
                console.log(chalk.yellow(`DRTools::TasksManager: Task done (queue count: ${this._queue.length}).`));
            }

            this._consumingQueue = false;
        } else if (this._consumingQueue && this._options?.debug) {
            console.log(chalk.yellow(`DRTools::TasksManager: A task is already running (queue count: ${this._queue.length}).`));
        }
    }
    /* istanbul ignore next */
    protected cleanOptions(): void {
        this._options = {
            debug: false,
            queueTick: 5000,
            runAsQueue: false,
            suffix: TasksConstants.Suffix,
            verbose: true,

            ...this._options !== null ? this._options : {},
        };
    }
    /* istanbul ignore next */
    protected runAtStart(): void {
        if (this.valid()) {
            Object.keys(<TasksList>this._items).forEach((key: string) => {
                const task: Task = (<TasksList>this._items)[key];
                if (task.runAtStart()) {
                    task.run();
                }
            });
        }
    }
    /* istanbul ignore next */
    protected setIntervals(): void {
        if (this.valid()) {
            for (const key of Object.keys(<TasksList>this._items)) {
                const task: Task = (<TasksList>this._items)[key];
                //
                // Are tasks being run when their time comes up?, or when their
                // time comes up are they being queued for the next queue available tick?
                if (!this._options || !this._options.runAsQueue) {
                    this._intervals.push(setInterval(() => {
                        if (this._options?.debug) {
                            console.log(chalk.yellow(`DRTools::TasksManager: Running task '${task.name()}'.`));
                        }

                        task.run();
                    }, task.interval()));
                } else {
                    this._intervals.push(setInterval(() => {
                        this._queue.push(task.run);

                        if (this._options?.debug) {
                            console.log(chalk.yellow(`DRTools::TasksManager: Task '${task.name()}' pushed into queue (queue count: ${this._queue.length}).`));
                        }
                    }, task.interval()));
                }
            }
            //
            // Setting a main interval to consume queued tasks.
            if (this._options?.runAsQueue) {
                this._queueInterval = setInterval(() => this.consumeQueue(), this._options?.queueTick || 5000);
            }
        }
    }
}
