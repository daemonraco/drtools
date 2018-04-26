/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
export interface MockRoutesOptions {
    verbose?: boolean;
}
export interface MockRoutesGuard {
    error?: string;
    guard: ExpressMiddleware;
    name: string;
    path: string;
}
export interface MockRoutesRoute {
    error?: string;
    guard?: ExpressMiddleware;
    guardName?: string;
    guardPath?: string;
    method: string;
    mime: string;
    originalPath: string;
    path: string;
    uri: string;
    valid: boolean;
}
