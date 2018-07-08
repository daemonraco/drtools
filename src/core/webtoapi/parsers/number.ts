/**
 * @file number.ts
 * @author Alejandro D. Simi
 */

import { WAParserTrimText } from './text';

export async function WAParserNumber(element: any, params: any): Promise<number> {
    return parseInt(await WAParserTrimText(element, params));
}
