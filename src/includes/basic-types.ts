/**
 * @file basic-types.ts
 * @author Alejandro D. Simi
 */

export type ExpressMiddleware = (res: any, req: any, next: () => void) => void;
export type OptionsList = { [name: string]: any };
