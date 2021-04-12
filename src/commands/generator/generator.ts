/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */
import { Command } from 'commander';
import { SubGenerator } from './sub-generator';
import { Tools } from '../includes/tools';
import * as path from 'path';
import glob from 'glob';

export class DRToolsGenerator {
    //
    // Protected properties.
    protected options: any = {};
    protected program = new Command();
    //
    // Constructor
    constructor() {
    }
    //
    // Protected methods.
    protected generatorOptions: any = {
        verbose: true
    };
    protected error: string | null = null;
    //
    // Public methods.
    public run(): void {
        this.setCommands();
        this.program.parse(process.argv);

        if (Object.keys(this.program.opts()).length < 1) {
            this.program.help();
        }
    }
    //
    // Protected methods.
    protected setCommands(): void {
        this.program
            .version(Tools.Instance().version(), `-v, --version`)

        const generatorPattern: RegExp = /^(.+)\.generator\..s$/;
        for (const p of glob.sync(path.join(__dirname, 'generators/*'))) {
            if (p.match(generatorPattern)) {
                const instance: SubGenerator = require(p);
                instance.load(this.program);
            }
        }

        this.program.addHelpText('beforeAll', `DRTools Generator (v${Tools.Instance().version()}):`);
    }
}
