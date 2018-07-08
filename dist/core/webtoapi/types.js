"use strict";
/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
class WAException {
    constructor(message, code = null) {
        this.code = null;
        this.message = null;
        this.toString = () => {
            return `${this.code ? `[${this.code}] ` : ''}${this.message}`;
        };
        this.code = code;
        this.message = message;
    }
}
exports.WAException = WAException;
