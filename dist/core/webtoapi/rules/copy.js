"use strict";
/**
 * @file copy.ts
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
const jsonpath = require('jsonpath-plus');
function WARuleCopy(rule, root) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = jsonpath({
            path: rule.from,
            json: root
        });
        root[rule.fieldName] = !rule.forceArray && results.length === 1 ? results[0] : results;
        return root;
    });
}
exports.WARuleCopy = WARuleCopy;
