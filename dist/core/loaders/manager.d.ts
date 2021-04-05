/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { ILoaderOptions } from '.';
export declare class LoadersManager extends GenericManager<ILoaderOptions> {
    constructor(directory: string, options?: ILoaderOptions | null, configs?: ConfigsManager | null);
    load(): Promise<boolean>;
    protected cleanOptions(): void;
}
