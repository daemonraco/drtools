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
    protected _items: TasksList | null;
    protected _queue: any[];
    protected _queueInterval: any;
    constructor(directories: string[] | string, options?: ITasksManagerOptions | null, configs?: ConfigsManager | null);
    load(): Promise<boolean>;
    tasks(): ITasksManager_TasksResponse[];
    protected consumeQueue(): Promise<void>;
    protected cleanOptions(): void;
    protected runAtStart(): Promise<void>;
    protected setIntervals(): void;
}
