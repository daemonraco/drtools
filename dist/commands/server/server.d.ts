export declare class DRToolsServer {
    protected availableUrls: any[];
    protected chalkForMethods: any;
    protected connectorOptions: any;
    protected error: string;
    protected port: boolean;
    protected webUI: boolean;
    run(): void;
    protected promptHeader(): void;
    protected parseArguments(): void;
    protected setAndLoadArguments(): void;
    protected startServer(): void;
}
