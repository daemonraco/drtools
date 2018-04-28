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
        if (libraries_1.commander.args < 1) {
            libraries_1.commander.help();
        }
    }
    //
    // Protected methods.
    promptHeader() {
        console.log(`DRTools Generator (v${tools_1.Tools.Instance().version()}):`);
    }
    generateMiddleware(name, directory, options) {
        let error = null;
        let cleanOptions = {
            force: options.force == true,
            suffix: options.suffix ? options.suffix : drtools_1.MiddlewaresConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;
        console.log(`Generating middleware`);
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
            console.log(`\tMiddleware file: '${libraries_1.chalk.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating middleware file...`);
            if (!cleanOptions.testRun) {
                const exists = libraries_1.fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.middleware.ejs')).toString();
                        libraries_1.fs.writeFileSync(cleanOptions.fullPath, libraries_1.ejs.render(template, {
                            name
                        }, {}));
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
    generateRoute(name, directory, options) {
        let error = null;
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
            console.log(`Generating route file...`);
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
    generateTask(name, directory, options) {
        let error = null;
        let cleanOptions = {
            force: options.force == true,
            interval: options.interval ? options.interval : 120000,
            runOnStart: options.runOnStart ? 'true' : 'false',
            suffix: options.suffix ? options.suffix : drtools_1.TasksConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;
        console.log(`Generating task`);
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
            console.log(`\tTask file: '${libraries_1.chalk.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating task file...`);
            if (!cleanOptions.testRun) {
                const exists = libraries_1.fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    const properName = name.replace(/[-_\.]/g, ' ')
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
                        .join(' ');
                    const properClassName = properName.replace(/ /g, '');
                    try {
                        const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.task.ejs')).toString();
                        libraries_1.fs.writeFileSync(cleanOptions.fullPath, libraries_1.ejs.render(template, {
                            interval: cleanOptions.interval,
                            name,
                            properClassName,
                            properName,
                            runOnStart: cleanOptions.runOnStart
                        }, {}));
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
    setCommands() {
        libraries_1.commander
            .version(tools_1.Tools.Instance().version(), `-v, --version`);
        libraries_1.commander
            .command(`mock-routes <directory>`)
            .alias(`mr`)
            .description(`generates a mock-up routes configuration based on the contents of a directory.`)
            .option(`-c, --config-name [name]`, `name of the config file to generate.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((directory, options) => {
            this.generateMockUpRoutes(directory, options);
        });
        libraries_1.commander
            .command(`middleware <name> <directory>`)
            .alias(`m`)
            .description(`generates a middleware with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${drtools_1.MiddlewaresConstants.Suffix}').`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generateMiddleware(name, directory, options);
        });
        libraries_1.commander
            .command(`route <name> <directory>`)
            .alias(`r`)
            .description(`generates a route with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${drtools_1.RoutesConstants.Suffix}').`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generateRoute(name, directory, options);
        });
        libraries_1.commander
            .command(`task <name> <directory>`)
            .alias(`t`)
            .description(`generates a task with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-i, --interval [number]`, `task interval in milliseconds (defalt: 2 minute).`)
            .option(`-r, --run-on-start`, `whether the task should run on start or not (default: false).`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${drtools_1.TasksConstants.Suffix}').`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generateTask(name, directory, options);
        });
        libraries_1.commander
            .action((cmd, options) => {
            console.error(libraries_1.chalk.red(`\nNo valid command specified.`));
            libraries_1.commander.help();
        });
        libraries_1.commander.outputHelp((text) => {
            this.promptHeader();
            return ``;
        });
    }
}
exports.DRToolsGenerator = DRToolsGenerator;
