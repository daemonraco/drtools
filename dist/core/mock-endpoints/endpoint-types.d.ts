/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
export declare type EndpointRawByMethod = {
    [method: string]: any;
};
export declare const EndpointPathPattern: RegExp;
export interface IEndpointBrief {
    behaviors: boolean;
    method?: string;
    path: string;
    uri: string;
}
export interface IEndpointBrievesByMethod {
    [method: string]: IEndpointBrief;
}
export interface IEndpointOptions {
    globalBehaviors?: string | string[];
}
export interface IEndpointsManagerOptions {
    directory: string;
    uri: string;
    options?: IEndpointOptions;
}
