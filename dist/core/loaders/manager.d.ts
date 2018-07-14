/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { ILoaderOptions } from '.';
export declare class LoadersManager extends GenericManager<ILoaderOptions> {
    constructor(directory: string, options?: ILoaderOptions, configs?: ConfigsManager);
    load(): Promise<boolean>;
    protected cleanOptions(): void;
}
