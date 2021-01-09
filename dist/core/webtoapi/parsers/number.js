"use strict";
/**
 * @file number.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAParserNumber = void 0;
const text_1 = require("./text");
async function WAParserNumber(element, params) {
    return parseInt(await text_1.WAParserTrimText(element, params));
}
exports.WAParserNumber = WAParserNumber;
