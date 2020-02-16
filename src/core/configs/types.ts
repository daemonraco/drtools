/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { IItemSpec } from '../includes';

export interface ConfigItemSpec {
    name: string;
    path: string;
    public?: boolean;
    specific?: IItemSpec;
    specsPath?: string;
};
export type ConfigsList = { [name: string]: any };
export interface IConfigOptions {
    environmentVariable?: boolean;
    suffix?: string;
    verbose?: boolean;
}
export type ConfigSpecsList = { [name: string]: any };
