/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
import { Endpoint, EndpointBehaviors, IEndpointBrievesByMethod } from '.';
import { IEndpointOptions, EndpointRawByMethod } from '.';
export declare class EndpointData {
    readonly BehaviorPattern: RegExp;
    protected _behaviors: EndpointBehaviors | null;
    protected _brievesByMethod: IEndpointBrievesByMethod;
    protected _endpoint: Endpoint | null;
    protected _exists: boolean;
    protected _options: IEndpointOptions;
    protected _raw: EndpointRawByMethod;
    protected _uri: string;
    constructor(endpoint: Endpoint, uri: string, options?: IEndpointOptions);
    brievesByMethod(): IEndpointBrievesByMethod;
    data(method?: string): any;
    protected expanded(out: any): any;
    protected fixOptions(): void;
    protected loadBehaviors(): void;
    protected loadGlobalBehaviors(): void;
    protected loadPaths(): void;
    protected loadRaw(): void;
}
