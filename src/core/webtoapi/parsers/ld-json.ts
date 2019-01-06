/**
 * @file ld-json.ts
 * @author Alejandro D. Simi
 */

export async function WAParserLDJson(element: any, params: any): Promise<string> {
    let results = null;

    try {
        results = JSON.parse(element.html());
    } catch (e) {
        // Ignoring exceptions.
    }

    return results;
}
