"use strict";
/**
 * @file constants.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAB5 = exports.TAB4 = exports.TAB3 = exports.TAB2 = exports.TAB = exports.BasicConstants = void 0;
var BasicConstants;
(function (BasicConstants) {
})(BasicConstants = exports.BasicConstants || (exports.BasicConstants = {}));
;
exports.TAB = global.DRTOOLS_TAB !== undefined
    ? global.DRTOOLS_TAB
    : '\t';
exports.TAB2 = `${exports.TAB}${exports.TAB}`;
exports.TAB3 = `${exports.TAB2}${exports.TAB}`;
exports.TAB4 = `${exports.TAB3}${exports.TAB}`;
exports.TAB5 = `${exports.TAB4}${exports.TAB}`;
