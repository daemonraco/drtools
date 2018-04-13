/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { OptionsList } from '../includes';

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
