/**
 * @file attribute.ts
 * @author Alejandro D. Simi
 */

export async function WAParserAttribute(element: any, params: any): Promise<string> {
    return element.length > 0 ? element.attr(params) : '';
}
