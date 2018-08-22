/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary, StringsDictionary } from '../includes';

export type WAEndpoint = any;

export type WAEndpointList = BasicDictionary<WAEndpoint>;

export class WAException {
    code: string = null;
    message: string = null;

    constructor(message: string, code: string = null) {
        this.code = code;
        this.message = message;
    }

    public toString = (): string => {
        return `${this.code ? `[${this.code}] ` : ''}${this.message}`;
    }
}

export type WAParsersList = BasicDictionary<Function>;

export type WARulesList = BasicDictionary<Function>;

export type WAUrlParameters = StringsDictionary;
