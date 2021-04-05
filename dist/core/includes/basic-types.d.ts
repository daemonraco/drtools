/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */
export declare type BasicDictionary<T = any> = {
    [key: string]: T;
};
export declare type BasicList<T = any> = T[];
export interface IItemSpec {
    name: string;
    path: string;
}
export declare type OptionsList = BasicDictionary<any>;
export declare type StringsDictionary = BasicDictionary<string>;
