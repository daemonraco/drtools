/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export interface PluginsOptions {
    verbose?: boolean;
}

export interface PluginSpecs {
    name: string;
    path: string;
    library: { [name: string]: any };
}

export type PluginSpecsList = { [name: string]: PluginSpecs };