import { Endpoint, EndpointBehaviors, EndpointBrievesByMethod } from '.';
import { EndpointOptions, EndpointRawByMethod } from '.';
export declare class EndpointData {
    readonly BehaviorPattern: RegExp;
    protected _behaviors: EndpointBehaviors;
    protected _brievesByMethod: EndpointBrievesByMethod;
    protected _endpoint: Endpoint;
    protected _exists: boolean;
    protected _options: EndpointOptions;
    protected _raw: EndpointRawByMethod;
    protected _uri: string;
    constructor(endpoint: Endpoint, uri: string, options?: EndpointOptions);
    brievesByMethod(): EndpointBrievesByMethod;
    data(method?: string): any;
    protected expanded(out: any): any;
    protected fixOptions(): void;
    protected loadBehaviors(): void;
    protected loadGlobalBehaviors(): void;
    protected loadPaths(): void;
    protected loadRaw(): void;
}
