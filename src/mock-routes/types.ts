/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { ExpressMiddleware } from '../express';

export interface MockRoutesOptions {
    verbose?: boolean;
}

export interface MockRoutesRoute {
    guard?: ExpressMiddleware;
    guardPath?: string;
    method: string;
    mime: string;
    originalPath: string;
    path: string;
    uri: string;
    valid: boolean;
}
