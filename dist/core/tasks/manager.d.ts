/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { ITasksManagerOptions, ITasksManager_TasksResponse, TasksList } from '.';
export declare class TasksManager extends GenericManager<ITasksManagerOptions> {
    protected _consumingQueue: boolean;
    protected _intervals: any[];
    protected _items: TasksList;
    protected _queue: any[];
    protected _queueInterval: any;
    constructor(directory: string, options?: ITasksManagerOptions, configs?: ConfigsManager);
    load(): Promise<boolean>;
    tasks(): ITasksManager_TasksResponse[];
    protected consumeQueue(): Promise<void>;
    protected cleanOptions(): void;
    protected runAtStart(): void;
    protected setIntervals(): void;
}
