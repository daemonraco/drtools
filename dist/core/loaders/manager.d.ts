/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { LoaderOptions } from '.';
export declare class LoadersManager extends GenericManager<LoaderOptions> {
    constructor(directory: string, options?: LoaderOptions, configs?: ConfigsManager);
    protected cleanOptions(): void;
    protected load(): void;
}
