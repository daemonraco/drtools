import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { TasksList, TasksManagerOptions } from '.';
export declare class TasksManager extends GenericManager<TasksManagerOptions> {
    protected _hasSpecialLoad: boolean;
    protected _intervals: any[];
    protected _items: TasksList;
    constructor(directory: string, options?: TasksManagerOptions, configs?: ConfigsManager);
    protected cleanOptions(): void;
    protected load(): void;
    protected runAtStart(): void;
    protected setIntervals(): void;
}
