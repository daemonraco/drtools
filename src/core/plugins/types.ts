/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export interface IPluginsOptions {
    dist?: boolean;
    verbose?: boolean;
}

export interface IPluginSpecs {
    name: string;
    path: string;
    library: { [name: string]: any };
}

export type IPluginSpecsList = { [name: string]: IPluginSpecs };