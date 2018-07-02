/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */

export interface ItemSpec {
    name: string;
    path: string;
};

export type OptionsList = { [name: string]: any };

export type StringsDictionary = { [name: string]: string };
