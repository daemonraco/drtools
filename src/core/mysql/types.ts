/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export interface IMySQLRestAuthMiddlewareData {

}

export type MySQLRestAuthMiddleware = (req: any, res: any, next: () => void, data: IMySQLRestAuthMiddlewareData) => void

export type MySQLRestConditions = { [fieldName: string]: any };

export type MySQLRestEntry = { [fieldName: string]: any };

export interface IMySQLRestExposeConfig {
    authMiddleware?: MySQLRestAuthMiddleware;
    limit?: number;
    name: string;
    prefix: string;
    tablePrefix?: string;
}
export interface IMySQLRestManagerConfig {
    expose?: IMySQLRestExposeConfig | IMySQLRestExposeConfig[];
    tablePrefix?: string;
    uri: string;
}

export type MySQLUrlParams = { [fieldName: string]: string };

export type MySQLUrlPieces = string[];

export type MySQLRestOrder = { [fieldName: string]: string };
