"use strict";
/**
 * @file text.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
async function WAParserText(element, params) {
    return element.text();
}
exports.WAParserText = WAParserText;
async function WAParserTrimText(element, params) {
    let results = await WAParserText(element, params);
    results = results.replace('&nbsp;', ' ');
    while (results.indexOf('\n') > -1) {
        results = results.replace('\n', ' ');
    }
    while (results.indexOf('  ') > -1) {
        results = results.replace('  ', ' ');
    }
    return results.trim();
}
exports.WAParserTrimText = WAParserTrimText;
