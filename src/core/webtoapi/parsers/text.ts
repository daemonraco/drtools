/**
 * @file text.ts
 * @author Alejandro D. Simi
 */

export function WAParserText(element: any, params: any): any {
    return element.text();
}

export function WAParserTrimText(element: any, params: any): any {
    let results = WAParserText(element, params);

    while (results.indexOf('\n') > -1) {
        results = results.replace('\n', ' ');
    }
    while (results.indexOf('  ') > -1) {
        results = results.replace('  ', ' ');
    }

    return results.trim();
}