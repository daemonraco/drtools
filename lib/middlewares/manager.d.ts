export declare type MiddlewaresList = {
    [name: string]: any;
};
export interface MiddlewareOptions {
    suffix?: string;
    verbose?: boolean;
}
export declare class MiddlewaresManager {
    protected _middlewaresDirectory: string;
    protected _options: MiddlewareOptions;
    constructor(app: any, middlewaresDirectory: string, options?: MiddlewareOptions);
    protected cleanOptions(): void;
    protected load(app: any, middlewaresDirectory: string): void;
}
