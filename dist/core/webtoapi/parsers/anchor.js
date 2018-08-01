"use strict";
/**
 * @file anchor.ts
 * @author Alejandro D. Simi
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../../includes/tools");
function WAParserAnchor(element, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield WAParserAnchorFull(element, params);
        if (result) {
            delete result.html;
            delete result.attrs;
        }
        return result;
    });
}
exports.WAParserAnchor = WAParserAnchor;
function WAParserAnchorFull(element, params) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.WAParserAnchorFull = WAParserAnchorFull;
