/**
 * @file pre-processor-data.ts
 * @author Alejandro D. Simi
 */

import { StringsDictionary } from '../includes';
import { WAEndpoint, WAUrlParameters } from './types';

export class WAPreProcessorData {
    //
    // Public properties.
    public endpoint: WAEndpoint = null;
    public forceAnalysis: boolean = false;
    public forceDownloading: boolean = false;
    public headers: StringsDictionary = null;
    public params: WAUrlParameters = null;
}
