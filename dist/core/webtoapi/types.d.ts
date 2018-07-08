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
export interface WAPostProcessorRequest {
    data: any;
    endpoint: WAEndpoint;
}
export interface WAPostProcessorResponse {
    data: any;
}
export interface WAPreProcessorRequest {
    endpoint: WAEndpoint;
    headers: StringsDictionary;
    params: WAUrlParameters;
}
export interface WAPreProcessorResponse {
    headers: StringsDictionary;
}
export declare type WAParsersList = BasicDictionary<Function>;
export declare type WAUrlParameters = StringsDictionary;
