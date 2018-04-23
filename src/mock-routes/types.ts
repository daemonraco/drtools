/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export interface MockRoutesOptions {
    verbose?: boolean;
}

export interface MockRoutesRoute {
    method: string;
    mime: string;
    path: string;
    uri: string;
    valid: boolean;
}
