/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IAsyncManager, IManagerByKey } from '../drcollector';
import { IItemSpec } from '.';
export declare abstract class GenericManager<TOptions> implements IAsyncManager, IManagerByKey {
    protected _configs: ConfigsManager;
    protected _directory: string;
    protected _itemSpecs: IItemSpec[];
    protected _lastError: string;
    protected _loaded: boolean;
    protected _options: TOptions;
    protected _valid: boolean;
    constructor(directory: string, options?: TOptions, configs?: ConfigsManager);
    directory(): string;
    items(): IItemSpec[];
    itemNames(): string[];
    lastError(): string;
    abstract load(): Promise<boolean>;
    loaded(): boolean;
    matchesKey(key: string): boolean;
    suffix(): string;
    valid(): boolean;
    protected checkDirectory(): void;
    protected abstract cleanOptions(): void;
    protected loadItemPaths(): void;
}
