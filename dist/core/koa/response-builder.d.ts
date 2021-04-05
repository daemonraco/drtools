export declare class KoaResponseBuilder {
    private constructor();
    static ConfigContents(managerKey: string, name: string): any;
    static ConfigSpecsContents(managerKey: string, name: string): any;
    static FullInfoResponse(): any;
    protected static CleanMDHtmlLinks(rootPath: string, docPath: string, html: string): string;
}
