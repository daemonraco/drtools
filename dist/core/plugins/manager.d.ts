import { ConfigsManager } from '../configs';
import { PluginsOptions, PluginSpecsList } from '.';
export declare class PluginsManager {
    protected _configs: ConfigsManager;
    protected _directories: string[];
    protected _itemSpecs: PluginSpecsList;
    protected _lastError: string;
    protected _options: PluginsOptions;
    protected _paths: any[];
    protected _valid: boolean;
    constructor(directories: string | string[], options?: PluginsOptions, configs?: ConfigsManager);
    configNameOf(name: string): string;
    configOf(name: string): any;
    configs(): ConfigsManager;
    directories(): string[];
    get(code: string): any;
    items(): PluginSpecsList;
    itemNames(): string[];
    lastError(): string;
    methodsOf(name: string): string[];
    pluginConfig(plgName: string): any;
    valid(): boolean;
    protected checkDirectories(): void;
    protected cleanOptions(): void;
    protected load(): void;
    protected loadItemPaths(): void;
}
