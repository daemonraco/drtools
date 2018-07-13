/**
 * @file express-types.ts
 * @author Alejandro D. Simi
 */
export declare type ExpressMiddleware = (req: any, res: any, next: () => void) => void;
export interface ExpressConnectorOptions {
    webUi?: boolean;
}
