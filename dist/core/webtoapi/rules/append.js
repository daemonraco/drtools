"use strict";
/**
 * @file append.ts
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
const libraries_1 = require("../../../libraries");
function WARuleAppend(rule, root) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalList = [];
        for (const propPath of rule.fieldPaths) {
            const results = libraries_1.jsonpath({
                path: propPath,
                json: root
            });
            for (const result of results) {
                if (Array.isArray(result)) {
                    for (const entry of result) {
                        finalList.push(entry);
                    }
                }
                else {
                    finalList.push(result);
                }
            }
        }
        root[rule.fieldName] = finalList;
        return root;
    });
}
exports.WARuleAppend = WARuleAppend;
