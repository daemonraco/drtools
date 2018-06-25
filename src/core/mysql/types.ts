/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

import { ExpressMiddleware } from '../express';

export interface MySQLRestAuthMiddlewareData {

}

export type MySQLRestAuthMiddleware = (req: any, res: any, next: () => void, data: MySQLRestAuthMiddlewareData) => void

export type MySQLRestConditions = { [fieldName: string]: any };

export type MySQLRestEntry = { [fieldName: string]: any };

export interface MySQLRestExposeConfig {
    authMiddleware?: MySQLRestAuthMiddleware;
    limit?: number;
    name: string;
    prefix: string;
    tablePrefix?: string;
}
export interface MySQLRestManagerConfig {
    expose?: MySQLRestExposeConfig | MySQLRestExposeConfig[];
    tablePrefix?: string;
    uri: string;
}

export type MySQLUrlParams = { [fieldName: string]: string };

export type MySQLUrlPieces = string[];

export type MySQLRestOrder = { [fieldName: string]: string };
