/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */
export declare type BasicDictionary<T> = {
    [key: string]: T;
};
export declare type BasicList<T> = T[];
export interface ItemSpec {
    name: string;
    path: string;
}
export declare type OptionsList = BasicDictionary<any>;
export declare type StringsDictionary = BasicDictionary<string>;
