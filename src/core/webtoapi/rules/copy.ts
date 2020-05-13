/**
 * @file copy.ts
 * @author Alejandro D. Simi
 */

const jsonpath = require('jsonpath-plus');

export async function WARuleCopy(rule: any, root: any): Promise<string> {
    const results: any = jsonpath({
        path: rule.from,
        json: root
    });

    root[rule.fieldName] = !rule.forceArray && results.length === 1 ? results[0] : results;

    return root;
}
