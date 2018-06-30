/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
export interface PluginsOptions {
    verbose?: boolean;
}
export interface PluginSpecs {
    name: string;
    library: {
        [name: string]: any;
    };
}
export declare type PluginSpecsList = {
    [name: string]: PluginSpecs;
};
