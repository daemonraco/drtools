"use strict";
/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const tools_1 = require("../includes/tools");
class DRToolsGenerator {
    //
    // Constructor
    constructor() {
        //
        // Protected properties.
        this._options = {};
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
        libraries_1.commander.parse(process.argv);
    }
    //
    // Protected methods.
    promptHeader() {
        console.log(`DRTools Generator (v${tools_1.Tools.Instance().version()}):\n`);
    }
    generateMockUpRoutes(directory, options) {
        let error = null;
        this.promptHeader();
        let cleanOptions = {
            configName: options.configName ? options.configName : 'routes.json',
            configPath: null,
            testRun: options.testRun == true
        };
        cleanOptions.configName += cleanOptions.configName.match(/\.json$/) ? '' : '.json';
        console.log(`Generating a mock-up routes`);
        console.log(`\tWorking directory:  '${libraries_1.chalk.green(directory)}'`);
        if (!error) {
            let stat = null;
            try {
                stat = libraries_1.fs.statSync(directory);
            }
            catch (e) { }
            if (!stat) {
                error = `'${directory}' is not a valid path.`;
            }
            else if (!stat.isDirectory()) {
                error = `'${directory}' is not a directory.`;
            }
            else {
                directory = libraries_1.path.resolve(directory);
            }
        }
        if (!error) {
            cleanOptions.configPath = libraries_1.path.join(directory, cleanOptions.configName);
            console.log(`\tConfiguration file: '${libraries_1.chalk.green(cleanOptions.configPath)}'`);
        }
        let routes = [];
        if (!error) {
            routes = libraries_1.glob.sync(libraries_1.path.join(directory, '**/*'))
                .sort()
                .filter((p) => {
                let stat = null;
                try {
                    stat = libraries_1.fs.statSync(p);
                }
                catch (e) { }
                return stat && stat.isFile();
            })
                .map((p) => p.substr(directory.length))
                .filter((p) => p !== `/${cleanOptions.configName}`)
                .map((p) => {
                return {
                    uri: p.replace(/\.[^\.]+$/, ''),
                    path: `.${p}`
                };
            });
            console.log(`\tLoaded routes:`);
            routes.forEach((r) => {
                console.log(`\t\t- '${libraries_1.chalk.green(r.uri)}' (file: '${libraries_1.chalk.magenta(r.path)}')`);
            });
        }
        if (!error) {
            console.log(`Generating configuration file...`);
            if (!cleanOptions.testRun) {
                try {
                    libraries_1.fs.writeFileSync(cleanOptions.configPath, JSON.stringify({
                        guards: [],
                        routes
                    }, null, 2));
                }
                catch (e) { }
            }
        }
        if (error) {
            console.log();
            console.error(libraries_1.chalk.red(error));
        }
    }
    setCommands() {
        libraries_1.commander
            .version(tools_1.Tools.Instance().version(), '-v, --version');
        libraries_1.commander
            .command('mock-routes <directory>')
            .alias('mr')
            .description('generates a mock-up routes configuration based on the contents of a directory.')
            .option('-c, --config-name [name]', 'name of the config file to generate.')
            .option('--test-run', 'does almost everything except actually generate files.')
            .action((directory, options) => {
            this.generateMockUpRoutes(directory, options);
        });
        libraries_1.commander
            .action((cmd, options) => {
            this.promptHeader();
            console.error(libraries_1.chalk.red(`No valid command specified.`));
            libraries_1.commander.help();
        });
    }
}
exports.DRToolsGenerator = DRToolsGenerator;
