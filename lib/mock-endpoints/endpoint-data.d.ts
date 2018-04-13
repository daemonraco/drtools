/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
import { EndpointBehaviors, EndpointOptions } from '.';
export declare class EndpointData {
    readonly BehaviorPattern: RegExp;
    protected _behaviors: EndpointBehaviors;
    protected _options: EndpointOptions;
    protected _raw: any;
    constructor(dummyDataPath: string, options?: EndpointOptions);
    data(): any;
    protected expanded(out: any): any;
    protected fixOptions(): void;
    protected loadBehaviors(dummyDataPath: string): void;
    protected loadGlobalBehaviors(): void;
    protected loadRaw(dummyDataPath: string): void;
}
