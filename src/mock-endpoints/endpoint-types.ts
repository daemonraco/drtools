/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { OptionsList } from '../includes';

export type EndpointRawByMethod = { [method: string]: any };

export const EndpointPathPattern: RegExp = /^(.*)\/(_METHODS)\/([a-z]+)\/(.+)\.json$|^(.+)(\.json)$/;

export interface EndpointBrief {
    behaviors: boolean;
    method: string;
    path: string;
    uri: string;
}

export interface EndpointBrievesByMethod {
    [method: string]: EndpointBrief;
}

export interface EndpointOptions {
    globalBehaviors?: string | string[];
}

export interface EndpointsManagerOptions {
    //
    // Mandatory options.
    directory: string;
    uri: string;
    //
    // Optional options.
    options?: EndpointOptions;
}
