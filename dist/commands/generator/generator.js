"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRToolsGenerator = void 0;
const tslib_1 = require("tslib");
/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */
const commander_1 = require("commander");
const drtools_1 = require("../../core/drtools");
const tools_1 = require("../includes/tools");
const tools_2 = require("../../core/includes/tools");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ejs_1 = tslib_1.__importDefault(require("ejs"));
const glob_1 = tslib_1.__importDefault(require("glob"));
class DRToolsGenerator {
    //
    // Constructor
    constructor() {
        //
        // Protected properties.
        this._options = {};
        this._program = new commander_1.Command();
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
        this._program.parse(process.argv);
        if (Object.keys(this._program.opts()).length < 1) {
            this._program.help();
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
        console.log(`\tWorking directory:  '${chalk_1.default.green(directory)}'`);
        if (!error) {
            const check = tools_2.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_2.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_2.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`\tMiddleware file: '${chalk_1.default.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating middleware file...`);
            if (!cleanOptions.testRun) {
                const exists = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const templatePath = options.koa
                            ? path.join(__dirname, '../../../assets/template.middleware.koa.ejs')
                            : path.join(__dirname, '../../../assets/template.middleware.ejs');
                        const template = fs.readFileSync(templatePath).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs_1.default.render(template, {
                            name,
                            globalConstant: drtools_1.MiddlewaresConstants.GlobalConfigPointer
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
            console.error(chalk_1.default.red(error));
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
        console.log(`\tWorking directory:  '${chalk_1.default.green(directory)}'`);
        if (!error) {
            const check = tools_2.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_2.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_2.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`\tRoute file: '${chalk_1.default.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating route file...`);
            if (!cleanOptions.testRun) {
                const exists = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const templatePath = options.koa
                            ? path.join(__dirname, '../../../assets/template.route.koa.ejs')
                            : path.join(__dirname, '../../../assets/template.route.ejs');
                        const template = fs.readFileSync(templatePath).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs_1.default.render(template, {
                            name,
                            globalConstant: drtools_1.RoutesConstants.GlobalConfigPointer
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
            console.error(chalk_1.default.red(error));
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
        console.log(`\tWorking directory:  '${chalk_1.default.green(directory)}'`);
        if (!error) {
            const check = tools_2.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_2.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_2.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        if (!error) {
            cleanOptions.configPath = path.join(directory, cleanOptions.configName);
            console.log(`\tConfiguration file: '${chalk_1.default.green(cleanOptions.configPath)}'`);
        }
        let routes = [];
        if (!error) {
            routes = glob_1.default.sync(path.join(directory, '**/*'))
                .sort()
                .filter((p) => {
                let stat = null;
                try {
                    stat = fs.statSync(p);
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
            for (const r of routes) {
                console.log(`\t\t- '${chalk_1.default.green(r.uri)}' (file: '${chalk_1.default.magenta(r.path)}')`);
            }
        }
        if (!error) {
            console.log(`Generating configuration file...`);
            if (!cleanOptions.testRun) {
                try {
                    fs.writeFileSync(cleanOptions.configPath, JSON.stringify({
                        guards: [],
                        routes
                    }, null, 2));
                }
                catch (e) { }
            }
        }
        if (error) {
            console.log();
            console.error(chalk_1.default.red(error));
        }
    }
    generatePlugin(name, directory, options) {
        let error = null;
        let cleanOptions = {
            configs: options.configs ? options.configs : null,
            force: options.force == true,
            testRun: options.testRun == true
        };
        console.log(`Generating plugin`);
        console.log(`\tName:              '${chalk_1.default.green(name)}'`);
        //
        // Checking plugins directory.
        if (!error) {
            const check = tools_2.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_2.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_2.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        cleanOptions.pluginDirectory = path.join(directory, name);
        cleanOptions.pluginIndex = path.join(cleanOptions.pluginDirectory, 'index.js');
        console.log(`\tWorking directory: '${chalk_1.default.green(directory)}'`);
        console.log(`\tPlugin directory:  '${chalk_1.default.green(cleanOptions.pluginDirectory)}'`);
        //
        // Checking configurations directory.
        if (!error && cleanOptions.configs) {
            const check = tools_2.Tools.CheckDirectory(cleanOptions.configs, process.cwd());
            switch (check.status) {
                case tools_2.ToolsCheckPath.Ok:
                    cleanOptions.configs = check.path;
                    break;
                case tools_2.ToolsCheckPath.WrongType:
                    error = `'${cleanOptions.configs}' is not a directory.`;
                    break;
                default:
                    error = `'${cleanOptions.configs}' is not a valid path.`;
                    break;
            }
        }
        if (!error && cleanOptions.configs) {
            cleanOptions.configFile = path.join(cleanOptions.configs, `${drtools_1.PluginsConstants.ConfigsPrefix}${name}.json`);
            console.log(`\tConfigs directory: '${chalk_1.default.green(cleanOptions.configs)}'`);
            console.log(`\tConfig file:       '${chalk_1.default.green(cleanOptions.configFile)}'`);
        }
        if (!error) {
            console.log();
        }
        //
        // Checking/Creating plugin directory.
        if (!error) {
            let stat = null;
            try {
                stat = fs.statSync(cleanOptions.pluginDirectory);
            }
            catch (e) { }
            if (stat && stat.isDirectory()) {
                // Nothing.
            }
            else if (!stat) {
                console.log(`Creating directory: '${chalk_1.default.green(cleanOptions.pluginDirectory)}'`);
                if (!cleanOptions.testRun) {
                    fs.mkdirSync(cleanOptions.pluginDirectory);
                }
            }
            else {
                error = `'${cleanOptions.pluginDirectory}' is not a directory.`;
            }
        }
        //
        // Creating plugin index.
        if (!error) {
            let stat = null;
            try {
                stat = fs.statSync(cleanOptions.pluginIndex);
            }
            catch (e) { }
            if (!stat) {
                // Nothing.
            }
            else if (!stat.isFile()) {
                error = `'${cleanOptions.pluginIndex}' is not a file.`;
            }
            else {
                if (!cleanOptions.force) {
                    error = `'${cleanOptions.pluginIndex}' already exists.`;
                }
            }
            if (!error) {
                console.log(`Creating file: '${chalk_1.default.green(cleanOptions.pluginIndex)}'`);
                if (!cleanOptions.testRun) {
                    try {
                        const template = fs.readFileSync(path.join(__dirname, '../../../assets/template.plugin-index.ejs')).toString();
                        fs.writeFileSync(cleanOptions.pluginIndex, ejs_1.default.render(template, {
                            name,
                            defaultMethod: drtools_1.PluginsConstants.DefaultMethod,
                            globalConstant: drtools_1.PluginsConstants.GlobalConfigPointer
                        }, {}));
                    }
                    catch (e) { }
                }
            }
        }
        //
        // Creating plugin config.
        if (!error && cleanOptions.configs) {
            let stat = null;
            try {
                stat = fs.statSync(cleanOptions.configFile);
            }
            catch (e) { }
            if (!stat) {
                // Nothing.
            }
            else if (!stat.isFile()) {
                error = `'${cleanOptions.configFile}' is not a file.`;
            }
            else {
                if (!cleanOptions.force) {
                    error = `'${cleanOptions.configFile}' already exists.`;
                }
            }
            if (!error) {
                console.log(`Creating file: '${chalk_1.default.green(cleanOptions.configFile)}'`);
                if (!cleanOptions.testRun) {
                    try {
                        const template = fs.readFileSync(path.join(__dirname, '../../../assets/template.plugin-config.ejs')).toString();
                        fs.writeFileSync(cleanOptions.configFile, ejs_1.default.render(template, {
                            name,
                            defaultMethod: drtools_1.PluginsConstants.DefaultMethod,
                            globalConstant: drtools_1.PluginsConstants.GlobalConfigPointer
                        }, {}));
                    }
                    catch (e) { }
                }
            }
        }
        if (error) {
            console.log();
            console.error(chalk_1.default.red(error));
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
        console.log(`\tWorking directory:  '${chalk_1.default.green(directory)}'`);
        if (!error) {
            const check = tools_2.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_2.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_2.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`\tTask file: '${chalk_1.default.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating task file...`);
            if (!cleanOptions.testRun) {
                const exists = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    const properName = name.replace(/[-_\.]/g, ' ')
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
                        .join(' ');
                    const properClassName = properName.replace(/ /g, '');
                    try {
                        const template = fs.readFileSync(path.join(__dirname, '../../../assets/template.task.ejs')).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs_1.default.render(template, {
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
            console.error(chalk_1.default.red(error));
        }
    }
    setCommands() {
        this._program
            .version(tools_1.Tools.Instance().version(), `-v, --version`);
        this._program
            .command(`mock-routes <directory>`)
            .alias(`mr`)
            .description(`generates a mock-up routes configuration based on the contents of a directory.`)
            .option(`-c, --config-name [name]`, `name of the config file to generate.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((directory, options) => {
            this.generateMockUpRoutes(directory, options);
        });
        this._program
            .command(`middleware <name> <directory>`)
            .alias(`m`)
            .description(`generates a middleware with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-k, --koa`, `creates a template for configurations using KoaJS.`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${drtools_1.MiddlewaresConstants.Suffix}').`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generateMiddleware(name, directory, options);
        });
        this._program
            .command(`plugin <name> <directory>`)
            .alias(`p`)
            .description(`generates a plugin directory with an initial structure.`)
            .option(`-c, --configs [directory]`, `directory where configuration files are stored.`)
            .option(`-f, --force`, `in case the destination assets exist, this option forces their replacement.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generatePlugin(name, directory, options);
        });
        this._program
            .command(`route <name> <directory>`)
            .alias(`r`)
            .description(`generates a route with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-k, --koa`, `creates a template for configurations using KoaJS.`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${drtools_1.RoutesConstants.Suffix}').`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generateRoute(name, directory, options);
        });
        this._program
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
        this._program
            .action((cmd, options) => {
            console.error(chalk_1.default.red(`\nNo valid command specified.`));
            this._program.help();
        });
        this._program.outputHelp((text) => {
            this.promptHeader();
            return ``;
        });
    }
}
exports.DRToolsGenerator = DRToolsGenerator;
