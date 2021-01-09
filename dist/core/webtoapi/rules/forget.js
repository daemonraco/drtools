"use strict";
/**
 * @file forget.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WARuleForget = void 0;
async function WARuleForget(rule, root) {
    delete root[rule.field];
    return root;
}
exports.WARuleForget = WARuleForget;
