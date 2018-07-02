"use strict";
/**
 * @file attribute.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
function WAParserAttribute(element, params) {
    return element.length > 0 ? element.attr(params) : undefined;
}
exports.WAParserAttribute = WAParserAttribute;
