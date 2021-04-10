export declare class DRToolsServer {
    protected availableUrls: any[];
    protected chalkForMethods: any;
    protected connectorOptions: any;
    protected error: string | null;
    protected port: boolean;
    protected program: import("commander").Command;
    protected webUI: boolean;
    run(): Promise<void>;
    protected promptHeader(): void;
    protected parseArguments(): void;
    protected setAndLoadArguments(): void;
    protected startServer(): Promise<void>;
}
