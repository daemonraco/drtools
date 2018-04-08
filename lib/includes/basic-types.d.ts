/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */
export declare type ExpressMiddleware = (res: any, req: any, next: () => void) => void;
export declare type OptionsList = {
    [name: string]: any;
};
