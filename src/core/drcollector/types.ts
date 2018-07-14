/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export interface IAsyncManager {
    load(): Promise<boolean>;
    loaded(): boolean;
}

export interface IManagerByKey {
    matchesKey(key: string): boolean;
}
