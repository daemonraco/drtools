/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { OptionsList } from '../includes';
export interface EndpointsManagerOptions {
    directory: string;
    uri: string;
    options?: OptionsList;
}
