/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { Task } from '.';
export declare type TasksList = {
    [name: string]: Task;
};
export interface ITasksManagerOptions {
    debug?: boolean;
    queueTick?: number;
    runAsQueue?: boolean;
    suffix?: string;
    verbose?: boolean;
}
export interface ITasksManager_TasksResponse {
    description: string;
    interval: number;
    name: string;
    path: string;
}
