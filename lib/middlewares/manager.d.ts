import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { MiddlewareOptions } from '.';
export declare class MiddlewaresManager extends GenericManager<MiddlewareOptions> {
    protected _hasSpecialLoad: boolean;
    constructor(app: any, directory: string, options?: MiddlewareOptions, configs?: ConfigsManager);
    protected cleanOptions(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
}
