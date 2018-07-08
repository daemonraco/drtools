/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
export interface MySQLRestAuthMiddlewareData {
}
export declare type MySQLRestAuthMiddleware = (req: any, res: any, next: () => void, data: MySQLRestAuthMiddlewareData) => void;
export declare type MySQLRestConditions = {
    [fieldName: string]: any;
};
export declare type MySQLRestEntry = {
    [fieldName: string]: any;
};
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
export declare type MySQLUrlParams = {
    [fieldName: string]: string;
};
export declare type MySQLUrlPieces = string[];
export declare type MySQLRestOrder = {
    [fieldName: string]: string;
};
