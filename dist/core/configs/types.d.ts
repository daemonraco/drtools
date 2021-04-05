/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { IItemSpec } from '../includes';
export interface IConfigItem {
    data: any;
    name: string;
    path: string;
    public?: boolean;
    specific?: IItemSpec;
    valid: boolean;
}
export interface IConfigSpecItem {
    name: string;
    path: string;
    specs?: any;
    valid: boolean;
    validator?: any;
}
export interface IConfigOptions {
    environmentVariables?: boolean;
    key?: string;
    specs?: string | string[];
    specsSuffix?: string;
    suffix?: string;
    verbose?: boolean;
}
