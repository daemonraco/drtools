export declare type EndpointRawByMethod = {
    [method: string]: any;
};
export declare const EndpointPathPattern: RegExp;
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
    directory: string;
    uri: string;
    options?: EndpointOptions;
}
