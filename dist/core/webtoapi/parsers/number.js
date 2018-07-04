"use strict";
/**
 * @file number.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("./text");
function WAParserNumber(element, params) {
    return parseInt(text_1.WAParserTrimText(element, params));
}
exports.WAParserNumber = WAParserNumber;
