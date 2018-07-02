/**
 * @file attribute.ts
 * @author Alejandro D. Simi
 */

export function WAParserAttribute(element: any, params: any): any {
    return element.length > 0 ? element.attr(params) : undefined;
}
