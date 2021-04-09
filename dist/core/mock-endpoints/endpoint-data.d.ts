/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
import { Endpoint, EndpointBehaviors, IEndpointBriefByMethod } from '.';
import { IEndpointOptions, EndpointRawByMethod } from '.';
export declare class EndpointData {
    readonly BehaviorPattern: RegExp;
    protected _behaviors: EndpointBehaviors | null;
    protected _briefByMethod: IEndpointBriefByMethod;
    protected _endpoint: Endpoint | null;
    protected _exists: boolean;
    protected _options: IEndpointOptions;
    protected _raw: EndpointRawByMethod;
    protected _uri: string;
    constructor(endpoint: Endpoint, uri: string, options?: IEndpointOptions);
    briefByMethod(): IEndpointBriefByMethod;
    data(method?: string): any;
    protected expanded(out: any): any;
    protected fixOptions(): void;
    protected loadBehaviors(): void;
    protected loadGlobalBehaviors(): void;
    protected loadPaths(): void;
    protected loadRaw(): void;
}
