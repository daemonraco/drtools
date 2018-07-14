/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { Task } from '.';

export type TasksList = { [name: string]: Task };

export interface ITasksManagerOptions {
    suffix?: string;
    verbose?: boolean;
}
