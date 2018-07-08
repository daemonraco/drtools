/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
export declare class ExpressResponseBuilder {
    private constructor();
    static ConfigContents(manager: ConfigsManager, name: string): any;
    static ConfigSpecsContents(manager: ConfigsManager, name: string): any;
    static DocsContents(doc: string, baseUrl: string): any;
    static FullInfoResponse(): any;
    protected static CleanMDHtmlLinks(rootPath: string, docPath: string, html: string): string;
}
