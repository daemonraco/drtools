/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export interface IPluginsOptions {
    configsPrefix?: string;
    dist?: boolean;
    distPath?: string;
    verbose?: boolean;
}

export interface IPluginSpecs {
    name: string;
    path: string;
    library: { [name: string]: any };
}

export type IPluginSpecsList = { [name: string]: IPluginSpecs };