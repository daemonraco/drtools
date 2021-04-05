/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IAsyncManager, IManagerByKey } from '../drcollector';
import { IPluginsOptions, IPluginSpecsList } from '.';
export declare class PluginsManager implements IAsyncManager, IManagerByKey {
    protected _configs: ConfigsManager | null;
    protected _directories: string[];
    protected _itemSpecs: IPluginSpecsList | null;
    protected _lastError: string | null;
    protected _loaded: boolean;
    protected _options: IPluginsOptions | null;
    protected _paths: any[];
    protected _valid: boolean;
    constructor(directory: string | string[], options?: IPluginsOptions | null, configs?: ConfigsManager | null);
    configNameOf(name: string): string;
    configOf(name: string): any;
    configs(): ConfigsManager | null;
    /** @deprecated */
    directory(): string;
    directories(): string[];
    get(code: string): any;
    items(): IPluginSpecsList;
    itemNames(): string[];
    lastError(): string | null;
    load(): Promise<boolean>;
    loaded(): boolean;
    matchesKey(key: string): boolean;
    methodsOf(name: string): string[];
    valid(): boolean;
    protected checkDirectories(): void;
    protected cleanOptions(): void;
    protected loadItemPaths(): void;
}
