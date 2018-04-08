/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */

import { ConfigsManager, ConfigOptions } from '../configs/manager';

export interface ExpressConnectorOptions {
    configsDirectory?: string;
    configsOptions?: ConfigOptions;
    publishConfigs?: boolean | string;
}
export interface ExpressConnectorAttachResults {
    configs?: ConfigsManager;
}
