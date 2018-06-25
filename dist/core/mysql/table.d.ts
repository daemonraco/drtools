/**
 * @file table.ts
 * @author Alejandro D. Simi
 */
import { MySQLRestConditions, MySQLRestEntry, MySQLRestOrder } from '.';
export declare class MySQLTable {
    protected _conf: any;
    protected _connection: any;
    protected _limit: number;
    protected _loaded: boolean;
    constructor(connection: any, conf: any);
    all(conditions?: MySQLRestConditions, order?: MySQLRestOrder, limit?: number, offset?: number, full?: boolean): Promise<any>;
    count(conditions?: MySQLRestConditions, full?: boolean): Promise<any>;
    delete(id: string | number): Promise<any>;
    get(id: string | number): Promise<MySQLRestEntry>;
    insert(data: any): Promise<any>;
    update(id: string | number, data: any): Promise<any>;
    protected cleanEntry(entry: MySQLRestEntry): MySQLRestEntry;
    protected load(): void;
}
