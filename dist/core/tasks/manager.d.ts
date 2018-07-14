/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { TasksList, ITasksManagerOptions } from '.';
export declare class TasksManager extends GenericManager<ITasksManagerOptions> {
    protected _intervals: any[];
    protected _items: TasksList;
    constructor(directory: string, options?: ITasksManagerOptions, configs?: ConfigsManager);
    tasks(): any[];
    protected cleanOptions(): void;
    protected load(): void;
    protected runAtStart(): void;
    protected setIntervals(): void;
}
