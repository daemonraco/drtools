/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */

export type BasicDictionary<T> = { [key: string]: T };
export type BasicList<T> = T[];

export interface IItemSpec {
    name: string;
    path: string;
};

export type OptionsList = BasicDictionary<any>;

export type StringsDictionary = BasicDictionary<string>;
