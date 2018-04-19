/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { ItemSpec } from '../includes';
export interface ConfigItemSpec {
    name: string;
    path: string;
    public?: boolean;
    specific?: ItemSpec;
    specsPath?: string;
}
export declare type ConfigsList = {
    [name: string]: any;
};
export interface ConfigOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare type ConfigSpecsList = {
    [name: string]: any;
};
