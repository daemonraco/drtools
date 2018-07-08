/**
 * @file html.ts
 * @author Alejandro D. Simi
 */

export async function WAParserHtml(element: any, params: any): Promise<string> {
    return element.html();
}
