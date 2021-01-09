"use strict";
/**
 * @file anchor.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAParserAnchorFull = exports.WAParserAnchor = void 0;
const tools_1 = require("../../includes/tools");
async function WAParserAnchor(element, params) {
    const result = await WAParserAnchorFull(element, params);
    if (result) {
        delete result.html;
        delete result.attrs;
    }
    return result;
}
exports.WAParserAnchor = WAParserAnchor;
async function WAParserAnchorFull(element, params) {
    let result = null;
    if (element.length > 0) {
        result = {
            text: element.text(),
            html: element.html(),
            link: null,
            attrs: tools_1.Tools.DeepCopy(element[0].attribs)
        };
        if (typeof result.attrs.href !== 'undefined') {
            result.link = result.attrs.href;
            delete result.attrs.href;
        }
    }
    return result;
}
exports.WAParserAnchorFull = WAParserAnchorFull;
