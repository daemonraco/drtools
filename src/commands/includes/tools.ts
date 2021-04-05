/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
import * as fs from 'fs-extra';
import * as path from 'path';

export class Tools {
    //
    // Private class properties.
    private static _Instance: Tools | null = null;
    //
    // Private properties.
    private _loaded: boolean = false;
    private _packageData: any = null;
    //
    // Constructor
    private constructor() {
        this.load();
    }
    //
    // Public methods.
    public packageData(): any {
        return this._packageData;
    }
    public version(): string {
        return this._packageData.version;
    }
    //
    // Private methods.
    private load(): void {
        if (!this._loaded) {
            this._loaded = true;

            this._packageData = require(path.join(__dirname, '../../../package.json'));
        }
    }
    //
    // Public class methods.
    public static CompletePath(incompletePath: string): string {
        return fs.existsSync(incompletePath) ? incompletePath : path.join(process.cwd(), incompletePath);
    }
    public static Instance(): Tools {
        if (!Tools._Instance) {
            Tools._Instance = new Tools();
        }

        return Tools._Instance;
    }
}
