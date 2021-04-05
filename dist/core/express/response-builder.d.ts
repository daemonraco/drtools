/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */
export declare class ExpressResponseBuilder {
    private constructor();
    static ConfigContents(managerKey: string, name: string): any;
    static ConfigSpecsContents(managerKey: string, name: string): any;
    static DocsContents(doc: string, baseUrl: string): any;
    static FullInfoResponse(): any;
    protected static CleanMDHtmlLinks(rootPath: string, docPath: string, html: string): string;
}
