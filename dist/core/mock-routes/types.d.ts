/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
export interface IMockRoutesOptions {
    verbose?: boolean;
}
export interface IMockRoutesGuard {
    error?: string;
    guard: ExpressMiddleware;
    name: string;
    path: string;
}
export interface IMockRoutesRoute {
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
