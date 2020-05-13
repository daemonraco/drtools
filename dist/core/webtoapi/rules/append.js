"use strict";
/**
 * @file append.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../../libraries");
async function WARuleAppend(rule, root) {
    const finalList = [];
    for (const propPath of rule.fieldPaths) {
        const results = libraries_1.jsonpath({
            path: propPath,
            json: root
        });
        for (const result of results) {
            if (Array.isArray(result)) {
                for (const entry of result) {
                    finalList.push(entry);
                }
            }
            else {
                finalList.push(result);
            }
        }
    }
    root[rule.fieldName] = finalList;
    return root;
}
exports.WARuleAppend = WARuleAppend;
