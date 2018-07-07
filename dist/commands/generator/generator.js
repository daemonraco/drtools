"use strict";
/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drtools_1 = require("../../core/drtools");
const tools_1 = require("../../core/includes/tools");
const tools_2 = require("../includes/tools");
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
        console.log(`DRTools Generator (v${tools_2.Tools.Instance().version()}):`);
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
    generatePlugin(name, directory, options) {
        let error = null;
        let cleanOptions = {
            configs: options.configs ? options.configs : null,
            force: options.force == true,
            testRun: options.testRun == true
        };
        console.log(`Generating plugin`);
        console.log(`\tName:              '${libraries_1.chalk.green(name)}'`);
        //
        // Checking plugins directory.
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
        cleanOptions.pluginDirectory = libraries_1.path.join(directory, name);
        cleanOptions.pluginIndex = libraries_1.path.join(cleanOptions.pluginDirectory, 'index.js');
        console.log(`\tWorking directory: '${libraries_1.chalk.green(directory)}'`);
        console.log(`\tPlugin directory:  '${libraries_1.chalk.green(cleanOptions.pluginDirectory)}'`);
        //
        // Checking configurations directory.
        if (!error && cleanOptions.configs) {
            let stat = null;
            try {
                stat = libraries_1.fs.statSync(cleanOptions.configs);
            }
            catch (e) { }
            if (!stat) {
                error = `'${cleanOptions.configs}' is not a valid path.`;
            }
            else if (!stat.isDirectory()) {
                error = `'${cleanOptions.configs}' is not a directory.`;
            }
            else {
                cleanOptions.configs = libraries_1.path.resolve(cleanOptions.configs);
            }
        }
        if (!error && cleanOptions.configs) {
            cleanOptions.configFile = libraries_1.path.join(cleanOptions.configs, `${drtools_1.PluginsConstants.ConfigsPrefix}${name}.json`);
            console.log(`\tConfigs directory: '${libraries_1.chalk.green(cleanOptions.configs)}'`);
            console.log(`\tConfig file:       '${libraries_1.chalk.green(cleanOptions.configFile)}'`);
        }
        if (!error) {
            console.log();
        }
        //
        // Checking/Creating plugin directory.
        if (!error) {
            let stat = null;
            try {
                stat = libraries_1.fs.statSync(cleanOptions.pluginDirectory);
            }
            catch (e) { }
            if (stat && stat.isDirectory()) {
                // Nothing.
            }
            else if (!stat) {
                console.log(`Creating directory: '${libraries_1.chalk.green(cleanOptions.pluginDirectory)}'`);
                if (!cleanOptions.testRun) {
                    libraries_1.fs.mkdirSync(cleanOptions.pluginDirectory);
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
                stat = libraries_1.fs.statSync(cleanOptions.pluginIndex);
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
                console.log(`Creating file: '${libraries_1.chalk.green(cleanOptions.pluginIndex)}'`);
                if (!cleanOptions.testRun) {
                    try {
                        const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.plugin-index.ejs')).toString();
                        libraries_1.fs.writeFileSync(cleanOptions.pluginIndex, libraries_1.ejs.render(template, {
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
                stat = libraries_1.fs.statSync(cleanOptions.configFile);
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
                console.log(`Creating file: '${libraries_1.chalk.green(cleanOptions.configFile)}'`);
                if (!cleanOptions.testRun) {
                    try {
                        const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.plugin-config.ejs')).toString();
                        libraries_1.fs.writeFileSync(cleanOptions.configFile, libraries_1.ejs.render(template, {
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
    generateWebToApi(type, name, options) {
        let error = null;
        let cleanOptions = {
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
            console.error(libraries_1.chalk.red(error));
        }
    }
    generateWebToApiConfig(name, options) {
        let error = null;
        console.log(`Generating WebToApi Configuration:`);
        console.log(`\tName:              '${libraries_1.chalk.green(name)}'`);
        console.log(`\tWorking directory: '${libraries_1.chalk.green(options.cwd)}'`);
        let fullPath = libraries_1.path.join(options.cwd, `${name}.json`);
        if (!error && !options.cachePath) {
            error = `No cache directory specified directory.`;
        }
        else {
            console.log(`\tCache directory:   '${libraries_1.chalk.green(options.cachePath)}'`);
        }
        if (!error) {
            const checkFP = tools_1.Tools.CheckFile(fullPath);
            switch (checkFP.status) {
                case tools_1.ToolsCheckPath.Ok:
                    if (!options.force) {
                        error = `'${fullPath}' already exist.`;
                    }
                    break;
                case tools_1.ToolsCheckPath.WrongType:
                    error = `'${fullPath}' already exist and it's not a file.`;
                    break;
                case tools_1.ToolsCheckPath.WrongChecker:
                    error = `unable to check '${fullPath}'.`;
                    break;
            }
        }
        if (!error) {
            console.log();
            console.log(`Creating '${libraries_1.chalk.green(fullPath)}'...`);
            if (!options.testRun) {
                try {
                    const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.wa.config.ejs')).toString();
                    libraries_1.fs.writeFileSync(fullPath, libraries_1.ejs.render(template, {
                        cacheDirectory: options.cachePath,
                        name
                    }, {}));
                }
                catch (e) { }
            }
        }
        if (error) {
            console.log();
            console.error(libraries_1.chalk.red(error));
        }
    }
    generateWebToApiPostProcessor(name, options) {
        let error = null;
        console.log(`Generating WebToApi Post-Processor Script:`);
        console.log(`\tName:              '${libraries_1.chalk.green(name)}'`);
        console.log(`\tWorking directory: '${libraries_1.chalk.green(options.cwd)}'`);
        let fullPath = libraries_1.path.join(options.cwd, `${name}.js`);
        if (!error) {
            const checkFP = tools_1.Tools.CheckFile(fullPath);
            switch (checkFP.status) {
                case tools_1.ToolsCheckPath.Ok:
                    if (!options.force) {
                        error = `'${fullPath}' already exist.`;
                    }
                    break;
                case tools_1.ToolsCheckPath.WrongType:
                    error = `'${fullPath}' already exist and it's not a file.`;
                    break;
                case tools_1.ToolsCheckPath.WrongChecker:
                    error = `unable to check '${fullPath}'.`;
                    break;
            }
        }
        if (!error) {
            console.log();
            console.log(`Creating '${libraries_1.chalk.green(fullPath)}'...`);
            if (!options.testRun) {
                try {
                    const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.wa.postprocessor.ejs')).toString();
                    libraries_1.fs.writeFileSync(fullPath, libraries_1.ejs.render(template, {
                        cacheDirectory: options.cachePath,
                        name
                    }, {}));
                }
                catch (e) { }
            }
        }
        if (error) {
            console.log();
            console.error(libraries_1.chalk.red(error));
        }
    }
    generateWebToApiPreProcessor(name, options) {
        let error = null;
        console.log(`Generating WebToApi Pre-Processor Script:`);
        console.log(`\tName:              '${libraries_1.chalk.green(name)}'`);
        console.log(`\tWorking directory: '${libraries_1.chalk.green(options.cwd)}'`);
        let fullPath = libraries_1.path.join(options.cwd, `${name}.js`);
        if (!error) {
            const checkFP = tools_1.Tools.CheckFile(fullPath);
            switch (checkFP.status) {
                case tools_1.ToolsCheckPath.Ok:
                    if (!options.force) {
                        error = `'${fullPath}' already exist.`;
                    }
                    break;
                case tools_1.ToolsCheckPath.WrongType:
                    error = `'${fullPath}' already exist and it's not a file.`;
                    break;
                case tools_1.ToolsCheckPath.WrongChecker:
                    error = `unable to check '${fullPath}'.`;
                    break;
            }
        }
        if (!error) {
            console.log();
            console.log(`Creating '${libraries_1.chalk.green(fullPath)}'...`);
            if (!options.testRun) {
                try {
                    const template = libraries_1.fs.readFileSync(libraries_1.path.join(__dirname, '../../../assets/template.wa.preprocessor.ejs')).toString();
                    libraries_1.fs.writeFileSync(fullPath, libraries_1.ejs.render(template, {
                        cacheDirectory: options.cachePath,
                        name
                    }, {}));
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
            .version(tools_2.Tools.Instance().version(), `-v, --version`);
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
            .command(`plugin <name> <directory>`)
            .alias(`p`)
            .description(`generates a plugin directory with an initial structure.`)
            .option(`-c, --configs [directory]`, `directory where configuration files are stored.`)
            .option(`-f, --force`, `in case the destination assets exist, this option forces their replacement.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generatePlugin(name, directory, options);
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
        let waDescription = `generates assets for HTML Web to API configuration asset.\n`;
        waDescription += `Types:\n`;
        waDescription += `\t- 'config': Main configuration.\n`;
        waDescription += `\t- 'post':   Post_processor script.\n`;
        waDescription += `\t- 'pre':    Pre-processor script.\n`;
        libraries_1.commander
            .command(`webtoapi <type> <name>`)
            .alias(`wa`)
            .description(`generates assets for HTML Web to API configuration asset.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-c, --cache [directory]`, `directrory where downloads cache is stored.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((type, name, options) => {
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
