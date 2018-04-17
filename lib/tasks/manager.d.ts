import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { TasksList, TasksManagerOptions } from '.';
export declare class TasksManager extends GenericManager<TasksManagerOptions> {
    protected _intervals: any[];
    protected _items: TasksList;
    constructor(directory: string, options?: TasksManagerOptions, configs?: ConfigsManager);
    tasks(): any[];
    protected cleanOptions(): void;
    protected load(): void;
    protected runAtStart(): void;
    protected setIntervals(): void;
}
