"use strict";
/**
 * @file text.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
function WAParserText(element, params) {
    return element.text();
}
exports.WAParserText = WAParserText;
function WAParserTrimText(element, params) {
    let results = WAParserText(element, params);
    while (results.indexOf('\n') > -1) {
        results = results.replace('\n', ' ');
    }
    while (results.indexOf('  ') > -1) {
        results = results.replace('  ', ' ');
    }
    return results.trim();
}
exports.WAParserTrimText = WAParserTrimText;
