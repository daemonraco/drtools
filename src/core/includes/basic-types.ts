/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */

export type BasicDictionary<T = any> = { [key: string]: T };
export type BasicList<T = any> = T[];

export interface IItemSpec {
    name: string;
    path: string;
};

export type OptionsList = BasicDictionary<any>;

export type StringsDictionary = BasicDictionary<string>;
