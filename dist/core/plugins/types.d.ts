/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
export interface IPluginsOptions {
    verbose?: boolean;
}
export interface IPluginSpecs {
    name: string;
    path: string;
    library: {
        [name: string]: any;
    };
}
export declare type IPluginSpecsList = {
    [name: string]: IPluginSpecs;
};
