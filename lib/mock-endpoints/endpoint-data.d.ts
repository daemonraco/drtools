/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */
import { EndpointBehaviors } from './endpoint-behaviors';
import { OptionsList } from '../includes/basic-types';
export declare class EndpointData {
    readonly BehaviorPattern: RegExp;
    protected _behaviors: EndpointBehaviors;
    protected _options: OptionsList;
    protected _raw: any;
    constructor(dummyDataPath: string, options?: object);
    data(): any;
    protected expanded(out: any): any;
    protected fixOptions(): void;
    protected loadBehaviors(dummyDataPath: string): void;
    protected loadGlobalBehaviors(): void;
    protected loadRaw(dummyDataPath: string): void;
}
