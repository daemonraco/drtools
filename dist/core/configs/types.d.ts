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
}
export declare type ConfigsList = {
    [name: string]: any;
};
export interface IConfigOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare type ConfigSpecsList = {
    [name: string]: any;
};
