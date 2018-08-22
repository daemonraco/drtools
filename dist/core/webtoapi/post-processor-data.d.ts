/**
 * @file post-processor-data.ts
 * @author Alejandro D. Simi
 */
import { WAEndpoint } from './types';
import { WAPreProcessorData } from './pre-processor-data';
export declare class WAPostProcessorData {
    data: any;
    endpoint: WAEndpoint;
    request: WAPreProcessorData;
}
