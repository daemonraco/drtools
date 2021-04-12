"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRToolsGenerator = void 0;
const tslib_1 = require("tslib");
/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */
const commander_1 = require("commander");
const tools_1 = require("../includes/tools");
const path = tslib_1.__importStar(require("path"));
const glob_1 = tslib_1.__importDefault(require("glob"));
class DRToolsGenerator {
    //
    // Constructor
    constructor() {
        //
        // Protected properties.
        this.options = {};
        this.program = new commander_1.Command();
        //
        // Protected methods.
        this.generatorOptions = {
            verbose: true
        };
        this.error = null;
    }
    //
    // Public methods.
    run() {
        this.setCommands();
        this.program.parse(process.argv);
        if (Object.keys(this.program.opts()).length < 1) {
            this.program.help();
        }
    }
    //
    // Protected methods.
    setCommands() {
        this.program
            .version(tools_1.Tools.Instance().version(), `-v, --version`);
        const generatorPattern = /^(.+)\.generator\..s$/;
        for (const p of glob_1.default.sync(path.join(__dirname, 'generators/*'))) {
            if (p.match(generatorPattern)) {
                const instance = require(p);
                instance.load(this.program);
            }
        }
        this.program.addHelpText('beforeAll', `DRTools Generator (v${tools_1.Tools.Instance().version()}):`);
    }
}
exports.DRToolsGenerator = DRToolsGenerator;
