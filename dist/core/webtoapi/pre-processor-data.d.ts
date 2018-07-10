/**
 * @file pre-processor-data.ts
 * @author Alejandro D. Simi
 */
import { StringsDictionary } from '../includes';
import { WAEndpoint, WAUrlParameters } from './types';
export declare class WAPreProcessorData {
    endpoint: WAEndpoint;
    forceAnalysis: boolean;
    forceDownloading: boolean;
    headers: StringsDictionary;
    params: WAUrlParameters;
}
