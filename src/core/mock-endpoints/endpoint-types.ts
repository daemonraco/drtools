/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

export type EndpointRawByMethod = { [method: string]: any };

export const EndpointPathPattern: RegExp = /^(.*)\/(_METHODS)\/([a-z]+)\/(.+)\.json$|^(.+)(\.json)$/;

export interface IEndpointBrief {
    behaviors: boolean;
    method?: string;
    path: string;
    uri: string;
}

export interface IEndpointBriefByMethod {
    [method: string]: IEndpointBrief;
}

export interface IEndpointOptions {
    globalBehaviors?: string | string[];
}

export interface IEndpointsManagerOptions {
    //
    // Mandatory options.
    directory: string;
    uri: string;
    //
    // Optional options.
    options?: IEndpointOptions;
}
