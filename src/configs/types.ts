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
};
export type ConfigsList = { [name: string]: any };
export interface ConfigOptions {
    suffix?: string;
    verbose?: boolean;
}
export type ConfigSpecsList = { [name: string]: any };
