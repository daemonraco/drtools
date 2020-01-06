/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { Task } from '.';

export type TasksList = { [name: string]: Task };

export interface ITasksManagerOptions {
    queueTick?: number;
    runAsQueue?: boolean;
    suffix?: string;
    verbose?: boolean;
}

export interface ITasksManager_TasksResponse {
    description: string,
    interval: number,
    name: string,
    path: string,
}