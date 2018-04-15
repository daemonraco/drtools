import { ConfigsManager } from '../configs';
import { ItemSpec } from '.';
export declare abstract class GenericManager<TOptions> {
    protected _configs: ConfigsManager;
    protected _directory: string;
    protected _hasSpecialLoad: boolean;
    protected _itemSpecs: ItemSpec[];
    protected _lastError: string;
    protected _options: TOptions;
    protected _valid: boolean;
    constructor(directory: string, options?: TOptions, configs?: ConfigsManager);
    directory(): string;
    lastError(): string;
    valid(): boolean;
    protected checkDirectory(): void;
    protected abstract cleanOptions(): void;
    protected abstract load(): void;
    protected loadItemPaths(): void;
}
