"use strict";
/**
 * @file ld-json.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
async function WAParserLDJson(element, params) {
    let results = null;
    try {
        results = JSON.parse(element.html());
    }
    catch (e) {
        // Ignoring exceptions.
    }
    return results;
}
exports.WAParserLDJson = WAParserLDJson;
