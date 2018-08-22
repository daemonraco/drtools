/**
 * @file append.ts
 * @author Alejandro D. Simi
 */

import { jsonpath } from '../../../libraries';

export async function WARuleAppend(rule: any, root: any): Promise<string> {
    const finalList: any[] = [];
    for (const propPath of rule.fieldPaths) {
        const results: any = jsonpath({
            path: propPath,
            json: root
        });

        for (const result of results) {
            if (Array.isArray(result)) {
                for (const entry of result) {
                    finalList.push(entry);
                }
            } else {
                finalList.push(result);
            }
        }
    }

    root[rule.fieldName] = finalList;

    return root;
}
