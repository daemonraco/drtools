export interface EndpointOptions {
    globalBehaviors?: string | string[];
}
export interface EndpointsManagerOptions {
    directory: string;
    uri: string;
    options?: EndpointOptions;
}
