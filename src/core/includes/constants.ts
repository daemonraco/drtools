/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */

export enum BasicConstants {
};

export const TAB: string = (<any>global).DRTOOLS_TAB !== undefined
    ? (<any>global).DRTOOLS_TAB
    : '\t' as const;
export const TAB2: string = `${TAB}${TAB}` as const;
export const TAB3: string = `${TAB2}${TAB}` as const;
export const TAB4: string = `${TAB3}${TAB}` as const;
export const TAB5: string = `${TAB4}${TAB}` as const;
