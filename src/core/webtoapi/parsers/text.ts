/**
 * @file text.ts
 * @author Alejandro D. Simi
 */

export async function WAParserText(element: any, params: any): Promise<string> {
    return element.text();
}

export async function WAParserTrimText(element: any, params: any): Promise<string> {
    let results = await WAParserText(element, params);

    while (results.indexOf('\n') > -1) {
        results = results.replace('\n', ' ');
    }
    while (results.indexOf('  ') > -1) {
        results = results.replace('  ', ' ');
    }

    return results.trim();
}