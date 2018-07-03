/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
export declare class Tools {
    private static _Instance;
    private _loaded;
    private _packageData;
    private constructor();
    packageData(): any;
    version(): string;
    private load;
    static CompletePath(incompletePath: string): string;
    static Instance(): Tools;
}
