/**
 * @file anchor.ts
 * @author Alejandro D. Simi
 */

import { Tools } from '../../includes/tools';

export async function WAParserAnchor(element: any, params: any): Promise<string> {
    const result: any = await WAParserAnchorFull(element, params);

    if (result) {
        delete result.html;
        delete result.attrs;
    }

    return result;
}

export async function WAParserAnchorFull(element: any, params: any): Promise<string> {
    let result: any = null;

    if (element.length > 0) {
        result = {
            text: element.text(),
            html: element.html(),
            link: null,
            attrs: Tools.DeepCopy(element[0].attribs)
        };

        if (typeof result.attrs.href !== 'undefined') {
            result.link = result.attrs.href;
            delete result.attrs.href;
        }
    }

    return result;
}
