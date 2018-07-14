/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { IMiddlewareOptions } from '.';
export declare class MiddlewaresManager extends GenericManager<IMiddlewareOptions> {
    constructor(app: any, directory: string, options?: IMiddlewareOptions, configs?: ConfigsManager);
    protected cleanOptions(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
}
