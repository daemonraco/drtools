export declare class DRToolsGenerator {
    protected _options: any;
    constructor();
    protected generatorOptions: any;
    protected error: string;
    run(): void;
    protected promptHeader(): void;
    protected generateRoute(name: string, directory: string, options: any): void;
    protected generateMockUpRoutes(directory: string, options: any): void;
    protected setCommands(): void;
}
