import { Endpoint } from '.';
export declare class EndpointBehaviors extends Object {
    [key: string]: any;
    protected static _PrivateBehaviors: string[];
    protected _endpoint: Endpoint;
    constructor(endpoint: Endpoint);
    endpoint(endpointPath: string, method?: string): any;
    lorem(params: any): any;
    randNumber(...args: any[]): number;
    randString(length?: number): string;
    importBehaviors(behaviors: any): void;
}
