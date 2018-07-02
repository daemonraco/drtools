/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export type WAEndpoint = any;

export type WAEndpointList = { [name: string]: WAEndpoint };

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

export type WAParsersList = { [name: string]: Function };

export type WAUrlParameters = { [key: string]: string };
