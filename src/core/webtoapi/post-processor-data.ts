/**
 * @file post-processor-data.ts
 * @author Alejandro D. Simi
 */

import { WAEndpoint } from './types';
import { WAPreProcessorData } from './pre-processor-data';

export class WAPostProcessorData {
    //
    // Public properties.
    public data: any = null;
    public endpoint: WAEndpoint = null;
    public request: WAPreProcessorData = null;
}