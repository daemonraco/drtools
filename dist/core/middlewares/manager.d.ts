/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { IMiddlewareOptions } from '.';
export declare class MiddlewaresManager extends GenericManager<IMiddlewareOptions> {
    protected _app: any;
    constructor(app: any, directory: string, options?: IMiddlewareOptions, configs?: ConfigsManager);
    load(): Promise<boolean>;
    protected cleanOptions(): void;
    protected loadAndAttach(): void;
}
