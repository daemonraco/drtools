/**
 * @file types.ts
 * @author Alejandro D. Simi
 */
export declare type ExpressMiddleware = (req: any, res: any, next: () => void) => void;
export interface IExpressConnectorOptions {
    webUi?: boolean;
}
