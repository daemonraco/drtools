/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
export declare type WAEndpoint = any;
export declare type WAEndpointList = {
    [name: string]: WAEndpoint;
};
export declare class WAException {
    code: string;
    message: string;
    constructor(message: string, code?: string);
    toString: () => string;
}
export declare type WAParsersList = {
    [name: string]: Function;
};
export declare type WAUrlParameters = {
    [key: string]: string;
};
