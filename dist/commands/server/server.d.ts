export declare class DRToolsServer {
    protected availableUrls: any[];
    protected chalkForMethods: any;
    protected connectorOptions: any;
    protected error: string;
    protected port: boolean;
    protected webUI: boolean;
    run(): void;
    protected setAndLoadArguments(): void;
    protected parseArguments(): void;
    protected startServer(): void;
}
