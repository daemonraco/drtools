/**
 * @file types.ts
 * @author Alejandro D. Simi
 */

export type KoaMiddleware = (ctx: any, next: () => void) => Promise<void>;

export interface IKoaConnectorOptions {
    webUi?: boolean;
}
