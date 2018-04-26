"use strict";
/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drtools_1 = require("../../core/drtools");
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
        if (libraries_1.commander.options.length <= 1 && libraries_1.commander.commands.length <= 1) {
            this.promptHeader();
            libraries_1.commander.help();
        }
    }
    //
    // Protected methods.
    promptHeader() {
        console.log(`DRTools Generator (v${tools_1.Tools.Instance().version()}):`);
    }
    generateRoute(name, directory, options) {
        let error = null;
        this.promptHeader();
        let cleanOptions = {
            force: options.force == true,
            suffix: options.suffix ? options.suffix : drtools_1.RoutesConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;
        console.log(`Generating route`);
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
            cleanOptions.fullPath = libraries_1.path.join(directory, cleanOptions.fullName);
            console.log(`\tRoute file: '${libraries_1.chalk.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating configuration file...`);
            if (!cleanOptions.testRun) {
                const exists = libraries_1.fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.route.ejs')).toString();
                        libraries_1.fs.writeFileSync(cleanOptions.fullPath, libraries_1.ejs.render(template, {}, {}));
                    }
                    catch (e) { }
                }
                else if (exists && !cleanOptions.force) {
                    error = `Path '${cleanOptions.fullPath}' already exists.`;
                }
            }
        }
        if (error) {
            console.log();
            console.error(libraries_1.chalk.red(error));
        }
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
            .command('route <name> <directory>')
            .alias('r')
            .description('generates a route with an initial structure.')
            .option('-f, --force', 'in case the destination file exists, this option forces its replacement.')
            .option('-s, --suffix [suffix]', 'suffix to use when generating a file.')
            .option('--test-run', 'does almost everything except actually generate files.')
            .action((name, directory, options) => {
            this.generateRoute(name, directory, options);
        });
        libraries_1.commander
            .action((cmd, options) => {
            this.promptHeader();
            console.error(libraries_1.chalk.red(`\nNo valid command specified.`));
            libraries_1.commander.help();
        });
    }
}
exports.DRToolsGenerator = DRToolsGenerator;
