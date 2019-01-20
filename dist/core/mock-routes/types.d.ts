/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
import { ExpressMiddleware } from '../express';
import { KoaMiddleware } from '../koa';
export interface IMockRoutesOptions {
    verbose?: boolean;
}
export interface IMockRoutesGuard {
    error?: string;
    guard: ExpressMiddleware | KoaMiddleware;
    name: string;
    path: string;
}
export interface IMockRoutesRoute {
    error?: string;
    guard?: any;
    guardName?: string;
    guardPath?: string;
    method: string;
    mime: string;
    originalPath: string;
    path: string;
    uri: string;
    valid: boolean;
}
