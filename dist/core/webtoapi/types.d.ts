/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, StringsDictionary } from '../includes';
export declare type WAEndpoint = any;
export declare type WAEndpointList = BasicDictionary<WAEndpoint>;
export declare class WAException {
    code: string;
    message: string;
    constructor(message: string, code?: string);
    toString: () => string;
}
export declare type WAParsersList = BasicDictionary<Function>;
export declare type WAUrlParameters = StringsDictionary;
