"use strict";
/**
 * @file copy.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WARuleCopy = void 0;
const libraries_1 = require("../../../libraries");
async function WARuleCopy(rule, root) {
    const results = libraries_1.jsonpath({
        path: rule.from,
        json: root
    });
    root[rule.fieldName] = !rule.forceArray && results.length === 1 ? results[0] : results;
    return root;
}
exports.WARuleCopy = WARuleCopy;
