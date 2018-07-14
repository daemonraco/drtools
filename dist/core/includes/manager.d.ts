/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IItemSpec } from '.';
import { IManagerByKey } from '../drcollector';
export declare abstract class GenericManager<TOptions> implements IManagerByKey {
    protected _configs: ConfigsManager;
    protected _directory: string;
    protected _itemSpecs: IItemSpec[];
    protected _lastError: string;
    protected _options: TOptions;
    protected _valid: boolean;
    constructor(directory: string, options?: TOptions, configs?: ConfigsManager);
    directory(): string;
    items(): IItemSpec[];
    itemNames(): string[];
    lastError(): string;
    matchesKey(key: string): boolean;
    suffix(): string;
    valid(): boolean;
    protected checkDirectory(): void;
    protected abstract cleanOptions(): void;
    protected abstract load(): void;
    protected loadItemPaths(): void;
}
