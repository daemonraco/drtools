/**
 * @file number.ts
 * @author Alejandro D. Simi
 */

import { WAParserTrimText } from './text';

export function WAParserNumber(element: any, params: any): any {
    return parseInt(WAParserTrimText(element, params));
}
