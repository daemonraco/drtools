/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { IManagerByKey } from '../drcollector';
import { IPluginsOptions, IPluginSpecsList } from '.';
export declare class PluginsManager implements IManagerByKey {
    protected _configs: ConfigsManager;
    protected _directories: string[];
    protected _itemSpecs: IPluginSpecsList;
    protected _lastError: string;
    protected _options: IPluginsOptions;
    protected _paths: any[];
    protected _valid: boolean;
    constructor(directories: string | string[], options?: IPluginsOptions, configs?: ConfigsManager);
    configNameOf(name: string): string;
    configOf(name: string): any;
    configs(): ConfigsManager;
    directories(): string[];
    get(code: string): any;
    items(): IPluginSpecsList;
    itemNames(): string[];
    lastError(): string;
    matchesKey(key: string): boolean;
    methodsOf(name: string): string[];
    pluginConfig(plgName: string): any;
    valid(): boolean;
    protected checkDirectories(): void;
    protected cleanOptions(): void;
    protected load(): void;
    protected loadItemPaths(): void;
}
