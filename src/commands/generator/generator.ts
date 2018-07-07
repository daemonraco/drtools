/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */

import { chalk, commander, ejs, fs, glob, path } from '../../libraries';

import { MiddlewaresConstants, PluginsConstants, RoutesConstants, TasksConstants } from '../../core/drtools';
import { Tools as CoreTools, ToolsCheckPath as CoreToolsCheckPath, ToolsCheckPathResult as CoreToolsCheckPathResult } from '../../core/includes/tools';
import { Tools } from '../includes/tools';

declare const __dirname: string;
declare const process: any;

export class DRToolsGenerator {
    //
    // Protected properties.
    protected _options: any = {};
    //
    // Constructor
    constructor() {
    }
    //
    // Protected methods.
    protected generatorOptions: any = {
        verbose: true
    };
    protected error: string = null;
    //
    // Public methods.
    public run(): void {
        this.setCommands();
        commander.parse(process.argv);

        if (commander.args < 1) {
            commander.help();
        }
    }
    //
    // Protected methods.
    protected promptHeader(): void {
        console.log(`DRTools Generator (v${Tools.Instance().version()}):`);
    }
    protected generateMiddleware(name: string, directory: string, options: any): void {
        let error: string = null;

        let cleanOptions: any = {
            force: options.force == true,
            suffix: options.suffix ? options.suffix : MiddlewaresConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;

        console.log(`Generating middleware`);
        console.log(`\tWorking directory:  '${chalk.green(directory)}'`);

        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(directory); } catch (e) { }
            if (!stat) {
                error = `'${directory}' is not a valid path.`;
            } else if (!stat.isDirectory()) {
                error = `'${directory}' is not a directory.`;
            } else {
                directory = path.resolve(directory);
            }
        }

        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`\tMiddleware file: '${chalk.green(cleanOptions.fullPath)}'`);
        }

        if (!error) {
            console.log(`Generating middleware file...`);
            if (!cleanOptions.testRun) {
                const exists: boolean = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.middleware.ejs')).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs.render(template, {
                            name
                        }, {}));
                    } catch (e) { }
                } else if (exists && !cleanOptions.force) {
                    error = `Path '${cleanOptions.fullPath}' already exists.`;
                }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateRoute(name: string, directory: string, options: any): void {
        let error: string = null;

        let cleanOptions: any = {
            force: options.force == true,
            suffix: options.suffix ? options.suffix : RoutesConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;

        console.log(`Generating route`);
        console.log(`\tWorking directory:  '${chalk.green(directory)}'`);

        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(directory); } catch (e) { }
            if (!stat) {
                error = `'${directory}' is not a valid path.`;
            } else if (!stat.isDirectory()) {
                error = `'${directory}' is not a directory.`;
            } else {
                directory = path.resolve(directory);
            }
        }

        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`\tRoute file: '${chalk.green(cleanOptions.fullPath)}'`);
        }

        if (!error) {
            console.log(`Generating route file...`);
            if (!cleanOptions.testRun) {
                const exists: boolean = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.route.ejs')).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs.render(template, {}, {}));
                    } catch (e) { }
                } else if (exists && !cleanOptions.force) {
                    error = `Path '${cleanOptions.fullPath}' already exists.`;
                }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateMockUpRoutes(directory: string, options: any): void {
        let error: string = null;

        let cleanOptions: any = {
            configName: options.configName ? options.configName : 'routes.json',
            configPath: null,
            testRun: options.testRun == true
        };
        cleanOptions.configName += cleanOptions.configName.match(/\.json$/) ? '' : '.json';

        console.log(`Generating a mock-up routes`);
        console.log(`\tWorking directory:  '${chalk.green(directory)}'`);

        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(directory); } catch (e) { }
            if (!stat) {
                error = `'${directory}' is not a valid path.`;
            } else if (!stat.isDirectory()) {
                error = `'${directory}' is not a directory.`;
            } else {
                directory = path.resolve(directory);
            }
        }

        if (!error) {
            cleanOptions.configPath = path.join(directory, cleanOptions.configName);
            console.log(`\tConfiguration file: '${chalk.green(cleanOptions.configPath)}'`);
        }

        let routes: string[] = [];
        if (!error) {
            routes = glob.sync(path.join(directory, '**/*'))
                .sort()
                .filter((p: string) => {
                    let stat: any = null;
                    try { stat = fs.statSync(p); } catch (e) { }
                    return stat && stat.isFile();
                })
                .map((p: string) => p.substr(directory.length))
                .filter((p: string) => p !== `/${cleanOptions.configName}`)
                .map((p: string) => {
                    return {
                        uri: p.replace(/\.[^\.]+$/, ''),
                        path: `.${p}`
                    };
                });

            console.log(`\tLoaded routes:`);
            routes.forEach((r: any) => {
                console.log(`\t\t- '${chalk.green(r.uri)}' (file: '${chalk.magenta(r.path)}')`);
            });
        }

        if (!error) {
            console.log(`Generating configuration file...`);
            if (!cleanOptions.testRun) {
                try {
                    fs.writeFileSync(cleanOptions.configPath, JSON.stringify({
                        guards: [],
                        routes
                    }, null, 2));
                } catch (e) { }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generatePlugin(name: string, directory: string, options: any): void {
        let error: string = null;

        let cleanOptions: any = {
            configs: options.configs ? options.configs : null,
            force: options.force == true,
            testRun: options.testRun == true
        };

        console.log(`Generating plugin`);
        console.log(`\tName:              '${chalk.green(name)}'`);
        //
        // Checking plugins directory.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(directory); } catch (e) { }
            if (!stat) {
                error = `'${directory}' is not a valid path.`;
            } else if (!stat.isDirectory()) {
                error = `'${directory}' is not a directory.`;
            } else {
                directory = path.resolve(directory);
            }
        }
        cleanOptions.pluginDirectory = path.join(directory, name);
        cleanOptions.pluginIndex = path.join(cleanOptions.pluginDirectory, 'index.js');
        console.log(`\tWorking directory: '${chalk.green(directory)}'`);
        console.log(`\tPlugin directory:  '${chalk.green(cleanOptions.pluginDirectory)}'`);
        //
        // Checking configurations directory.
        if (!error && cleanOptions.configs) {
            let stat: any = null;
            try { stat = fs.statSync(cleanOptions.configs); } catch (e) { }
            if (!stat) {
                error = `'${cleanOptions.configs}' is not a valid path.`;
            } else if (!stat.isDirectory()) {
                error = `'${cleanOptions.configs}' is not a directory.`;
            } else {
                cleanOptions.configs = path.resolve(cleanOptions.configs);
            }
        }
        if (!error && cleanOptions.configs) {
            cleanOptions.configFile = path.join(cleanOptions.configs, `${PluginsConstants.ConfigsPrefix}${name}.json`);

            console.log(`\tConfigs directory: '${chalk.green(cleanOptions.configs)}'`);
            console.log(`\tConfig file:       '${chalk.green(cleanOptions.configFile)}'`);
        }

        if (!error) {
            console.log();
        }
        //
        // Checking/Creating plugin directory.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(cleanOptions.pluginDirectory); } catch (e) { }
            if (stat && stat.isDirectory()) {
                // Nothing.
            } else if (!stat) {
                console.log(`Creating directory: '${chalk.green(cleanOptions.pluginDirectory)}'`);
                if (!cleanOptions.testRun) {
                    fs.mkdirSync(cleanOptions.pluginDirectory);
                }
            } else {
                error = `'${cleanOptions.pluginDirectory}' is not a directory.`;
            }
        }
        //
        // Creating plugin index.
        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(cleanOptions.pluginIndex); } catch (e) { }

            if (!stat) {
                // Nothing.
            } else if (!stat.isFile()) {
                error = `'${cleanOptions.pluginIndex}' is not a file.`;
            } else {
                if (!cleanOptions.force) {
                    error = `'${cleanOptions.pluginIndex}' already exists.`;
                }
            }

            if (!error) {
                console.log(`Creating file: '${chalk.green(cleanOptions.pluginIndex)}'`);
                if (!cleanOptions.testRun) {
                    try {
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.plugin-index.ejs')).toString();
                        fs.writeFileSync(cleanOptions.pluginIndex, ejs.render(template, {
                            name,
                            defaultMethod: PluginsConstants.DefaultMethod,
                            globalConstant: PluginsConstants.GlobalConfigPointer
                        }, {}));
                    } catch (e) { }
                }
            }
        }
        //
        // Creating plugin config.
        if (!error && cleanOptions.configs) {
            let stat: any = null;
            try { stat = fs.statSync(cleanOptions.configFile); } catch (e) { }

            if (!stat) {
                // Nothing.
            } else if (!stat.isFile()) {
                error = `'${cleanOptions.configFile}' is not a file.`;
            } else {
                if (!cleanOptions.force) {
                    error = `'${cleanOptions.configFile}' already exists.`;
                }
            }

            if (!error) {
                console.log(`Creating file: '${chalk.green(cleanOptions.configFile)}'`);
                if (!cleanOptions.testRun) {
                    try {
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.plugin-config.ejs')).toString();
                        fs.writeFileSync(cleanOptions.configFile, ejs.render(template, {
                            name,
                            defaultMethod: PluginsConstants.DefaultMethod,
                            globalConstant: PluginsConstants.GlobalConfigPointer
                        }, {}));
                    } catch (e) { }
                }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateTask(name: string, directory: string, options: any): void {
        let error: string = null;

        let cleanOptions: any = {
            force: options.force == true,
            interval: options.interval ? options.interval : 120000,
            runOnStart: options.runOnStart ? 'true' : 'false',
            suffix: options.suffix ? options.suffix : TasksConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;

        console.log(`Generating task`);
        console.log(`\tWorking directory:  '${chalk.green(directory)}'`);

        if (!error) {
            let stat: any = null;
            try { stat = fs.statSync(directory); } catch (e) { }
            if (!stat) {
                error = `'${directory}' is not a valid path.`;
            } else if (!stat.isDirectory()) {
                error = `'${directory}' is not a directory.`;
            } else {
                directory = path.resolve(directory);
            }
        }

        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`\tTask file: '${chalk.green(cleanOptions.fullPath)}'`);
        }

        if (!error) {
            console.log(`Generating task file...`);
            if (!cleanOptions.testRun) {
                const exists: boolean = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    const properName: string = name.replace(/[-_\.]/g, ' ')
                        .split(' ')
                        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
                        .join(' ');
                    const properClassName: string = properName.replace(/ /g, '');

                    try {
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.task.ejs')).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs.render(template, {
                            interval: cleanOptions.interval,
                            name,
                            properClassName,
                            properName,
                            runOnStart: cleanOptions.runOnStart
                        }, {}));
                    } catch (e) { }
                } else if (exists && !cleanOptions.force) {
                    error = `Path '${cleanOptions.fullPath}' already exists.`;
                }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateWebToApi(type: string, name: string, options: any): void {
        let error: string = null;

        let cleanOptions: any = {
            force: options.force == true,
            cwd: process.cwd(),
            cachePath: options.cache,
            // interval: options.interval ? options.interval : 120000,
            // runOnStart: options.runOnStart ? 'true' : 'false',
            // suffix: options.suffix ? options.suffix : TasksConstants.Suffix,
            testRun: options.testRun == true
        };

        switch (type) {
            case 'config':
                this.generateWebToApiConfig(name, cleanOptions);
                break;
            case 'post':
                this.generateWebToApiPostProcessor(name, cleanOptions);
                break;
            case 'pre':
                this.generateWebToApiPreProcessor(name, cleanOptions);
                break;
            default:
                error = `Unknown type '${type}'.`;
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateWebToApiConfig(name: string, options: any): void {
        let error: string = null;

        console.log(`Generating WebToApi Configuration:`);
        console.log(`\tName:              '${chalk.green(name)}'`);
        console.log(`\tWorking directory: '${chalk.green(options.cwd)}'`);

        let fullPath: string = path.join(options.cwd, `${name}.json`);

        if (!error && !options.cachePath) {
            error = `No cache directory specified directory.`;
        } else {
            console.log(`\tCache directory:   '${chalk.green(options.cachePath)}'`);
        }

        if (!error) {
            const checkFP: CoreToolsCheckPathResult = CoreTools.CheckFile(fullPath);
            switch (checkFP.status) {
                case CoreToolsCheckPath.Ok:
                    if (!options.force) {
                        error = `'${fullPath}' already exist.`;
                    }
                    break;
                case CoreToolsCheckPath.WrongType:
                    error = `'${fullPath}' already exist and it's not a file.`;
                    break;
                case CoreToolsCheckPath.WrongChecker:
                    error = `unable to check '${fullPath}'.`;
                    break;
            }
        }

        if (!error) {
            console.log();

            console.log(`Creating '${chalk.green(fullPath)}'...`);
            if (!options.testRun) {
                try {
                    const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.wa.config.ejs')).toString();
                    fs.writeFileSync(fullPath, ejs.render(template, {
                        cacheDirectory: options.cachePath,
                        name
                    }, {}));
                } catch (e) { }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateWebToApiPostProcessor(name: string, options: any): void {
        let error: string = null;

        console.log(`Generating WebToApi Post-Processor Script:`);
        console.log(`\tName:              '${chalk.green(name)}'`);
        console.log(`\tWorking directory: '${chalk.green(options.cwd)}'`);

        let fullPath: string = path.join(options.cwd, `${name}.js`);

        if (!error) {
            const checkFP: CoreToolsCheckPathResult = CoreTools.CheckFile(fullPath);
            switch (checkFP.status) {
                case CoreToolsCheckPath.Ok:
                    if (!options.force) {
                        error = `'${fullPath}' already exist.`;
                    }
                    break;
                case CoreToolsCheckPath.WrongType:
                    error = `'${fullPath}' already exist and it's not a file.`;
                    break;
                case CoreToolsCheckPath.WrongChecker:
                    error = `unable to check '${fullPath}'.`;
                    break;
            }
        }

        if (!error) {
            console.log();

            console.log(`Creating '${chalk.green(fullPath)}'...`);
            if (!options.testRun) {
                try {
                    const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.wa.postprocessor.ejs')).toString();
                    fs.writeFileSync(fullPath, ejs.render(template, {
                        cacheDirectory: options.cachePath,
                        name
                    }, {}));
                } catch (e) { }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected generateWebToApiPreProcessor(name: string, options: any): void {
        let error: string = null;

        console.log(`Generating WebToApi Pre-Processor Script:`);
        console.log(`\tName:              '${chalk.green(name)}'`);
        console.log(`\tWorking directory: '${chalk.green(options.cwd)}'`);

        let fullPath: string = path.join(options.cwd, `${name}.js`);

        if (!error) {
            const checkFP: CoreToolsCheckPathResult = CoreTools.CheckFile(fullPath);
            switch (checkFP.status) {
                case CoreToolsCheckPath.Ok:
                    if (!options.force) {
                        error = `'${fullPath}' already exist.`;
                    }
                    break;
                case CoreToolsCheckPath.WrongType:
                    error = `'${fullPath}' already exist and it's not a file.`;
                    break;
                case CoreToolsCheckPath.WrongChecker:
                    error = `unable to check '${fullPath}'.`;
                    break;
            }
        }

        if (!error) {
            console.log();

            console.log(`Creating '${chalk.green(fullPath)}'...`);
            if (!options.testRun) {
                try {
                    const template: string = fs.readFileSync(path.join(__dirname, '../../../assets/template.wa.preprocessor.ejs')).toString();
                    fs.writeFileSync(fullPath, ejs.render(template, {
                        cacheDirectory: options.cachePath,
                        name
                    }, {}));
                } catch (e) { }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
    protected setCommands(): void {
        commander
            .version(Tools.Instance().version(), `-v, --version`)

        commander
            .command(`mock-routes <directory>`)
            .alias(`mr`)
            .description(`generates a mock-up routes configuration based on the contents of a directory.`)
            .option(`-c, --config-name [name]`,
                `name of the config file to generate.`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((directory: any, options: any) => {
                this.generateMockUpRoutes(directory, options);
            });

        commander
            .command(`middleware <name> <directory>`)
            .alias(`m`)
            .description(`generates a middleware with an initial structure.`)
            .option(`-f, --force`,
                `in case the destination file exists, this option forces its replacement.`)
            .option(`-s, --suffix [suffix]`,
                `suffix to use when generating a file (default: '${MiddlewaresConstants.Suffix}').`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((name: any, directory: any, options: any) => {
                this.generateMiddleware(name, directory, options);
            });

        commander
            .command(`plugin <name> <directory>`)
            .alias(`p`)
            .description(`generates a plugin directory with an initial structure.`)
            .option(`-c, --configs [directory]`,
                `directory where configuration files are stored.`)
            .option(`-f, --force`,
                `in case the destination assets exist, this option forces their replacement.`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((name: any, directory: any, options: any) => {
                this.generatePlugin(name, directory, options);
            });

        commander
            .command(`route <name> <directory>`)
            .alias(`r`)
            .description(`generates a route with an initial structure.`)
            .option(`-f, --force`,
                `in case the destination file exists, this option forces its replacement.`)
            .option(`-s, --suffix [suffix]`,
                `suffix to use when generating a file (default: '${RoutesConstants.Suffix}').`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((name: any, directory: any, options: any) => {
                this.generateRoute(name, directory, options);
            });

        commander
            .command(`task <name> <directory>`)
            .alias(`t`)
            .description(`generates a task with an initial structure.`)
            .option(`-f, --force`,
                `in case the destination file exists, this option forces its replacement.`)
            .option(`-i, --interval [number]`,
                `task interval in milliseconds (defalt: 2 minute).`)
            .option(`-r, --run-on-start`,
                `whether the task should run on start or not (default: false).`)
            .option(`-s, --suffix [suffix]`,
                `suffix to use when generating a file (default: '${TasksConstants.Suffix}').`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((name: any, directory: any, options: any) => {
                this.generateTask(name, directory, options);
            });

        let waDescription: string = `generates assets for HTML Web to API configuration asset.\n`;
        waDescription += `Types:\n`;
        waDescription += `\t- 'config': Main configuration.\n`;
        waDescription += `\t- 'post':   Post_processor script.\n`;
        waDescription += `\t- 'pre':    Pre-processor script.\n`;
        commander
            .command(`webtoapi <type> <name>`)
            .alias(`wa`)
            .description(`generates assets for HTML Web to API configuration asset.`)
            .option(`-f, --force`,
                `in case the destination file exists, this option forces its replacement.`)
            .option(`-c, --cache [directory]`,
                `directrory where downloads cache is stored.`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((type: any, name: any, options: any) => {
                this.generateWebToApi(type, name, options);
            })
            .on('--help', () => {
                console.log();
                console.log('  Types:');
                console.log();
                console.log(`    'config'    main configuration.`);
                console.log(`    'post'      post-processor script.`);
                console.log(`    'pre'       pre-processor script.`);
            });

        commander
            .action((cmd: any, options: any) => {
                console.error(chalk.red(`\nNo valid command specified.`));
                commander.help();
            });
        commander.outputHelp((text: string) => {
            this.promptHeader();
            return ``;
        });
    }
}
