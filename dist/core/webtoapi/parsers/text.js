"use strict";
/**
 * @file text.ts
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
function WAParserText(element, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return element.text();
    });
}
exports.WAParserText = WAParserText;
function WAParserTrimText(element, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = yield WAParserText(element, params);
        while (results.indexOf('\n') > -1) {
            results = results.replace('\n', ' ');
        }
        while (results.indexOf('  ') > -1) {
            results = results.replace('  ', ' ');
        }
        return results.trim();
    });
}
exports.WAParserTrimText = WAParserTrimText;
