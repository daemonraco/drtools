"use strict";
const tslib_1 = require("tslib");
const plugins_1 = require("../../../core/plugins");
const sub_generator_1 = require("../sub-generator");
const includes_1 = require("../../../core/includes");
const tools_1 = require("../../../core/includes/tools");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ejs_1 = tslib_1.__importDefault(require("ejs"));
class PluginGeneratorClass extends sub_generator_1.SubGenerator {
    //
    // Public methods.
    load(program) {
        program
            .command(`plugin <name> <directory>`)
            .alias(`p`)
            .description(`generates a plugin directory with an initial structure.`)
            .option(`-c, --configs [directory]`, `directory where configuration files are stored.`)
            .option(`-f, --force`, `in case the destination assets exist, this option forces their replacement.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((name, directory, options) => {
            this.generate(name, directory, options);
            process.exit();
        });
    }
    //
    // Protected methods.
    generate(name, directory, options) {
        let error = null;
        let cleanOptions = {
            configs: options.configs ? options.configs : null,
            force: options.force == true,
            testRun: options.testRun == true
        };
        console.log(`Generating plugin`);
        console.log(`${includes_1.TAB}Name:              '${chalk_1.default.green(name)}'`);
        //
        // Checking plugins directory.
        if (!error) {
            const check = tools_1.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_1.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_1.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        cleanOptions.pluginDirectory = path.join(directory, name);
        cleanOptions.pluginIndex = path.join(cleanOptions.pluginDirectory, 'index.js');
        console.log(`${includes_1.TAB}Working directory: '${chalk_1.default.green(directory)}'`);
        console.log(`${includes_1.TAB}Plugin directory:  '${chalk_1.default.green(cleanOptions.pluginDirectory)}'`);
        //
        // Checking configurations directory.
        if (!error && cleanOptions.configs) {
            const check = tools_1.Tools.CheckDirectory(cleanOptions.configs, process.cwd());
            switch (check.status) {
                case tools_1.ToolsCheckPath.Ok:
                    cleanOptions.configs = check.path;
                    break;
                case tools_1.ToolsCheckPath.WrongType:
                    error = `'${cleanOptions.configs}' is not a directory.`;
                    break;
                default:
                    error = `'${cleanOptions.configs}' is not a valid path.`;
                    break;
            }
        }
        if (!error && cleanOptions.configs) {
            cleanOptions.configFile = path.join(cleanOptions.configs, `${plugins_1.PluginsConstants.ConfigsPrefix}${name}.json`);
            console.log(`${includes_1.TAB}Configs directory: '${chalk_1.default.green(cleanOptions.configs)}'`);
            console.log(`${includes_1.TAB}Config file:       '${chalk_1.default.green(cleanOptions.configFile)}'`);
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
                        const template = fs.readFileSync(path.join(__dirname, '../../../../assets/template.plugin-index.ejs')).toString();
                        fs.writeFileSync(cleanOptions.pluginIndex, ejs_1.default.render(template, {
                            name,
                            defaultMethod: plugins_1.PluginsConstants.DefaultMethod,
                            globalConstant: plugins_1.PluginsConstants.GlobalConfigPointer
                        }, {}));
                    }
                    catch (err) {
                        console.error(chalk_1.default.red(`${err}`));
                    }
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
                        const template = fs.readFileSync(path.join(__dirname, '../../../../assets/template.plugin-config.ejs')).toString();
                        fs.writeFileSync(cleanOptions.configFile, ejs_1.default.render(template, {
                            name,
                            defaultMethod: plugins_1.PluginsConstants.DefaultMethod,
                            globalConstant: plugins_1.PluginsConstants.GlobalConfigPointer
                        }, {}));
                    }
                    catch (err) {
                        console.error(chalk_1.default.red(`${err}`));
                    }
                }
            }
        }
        if (error) {
            console.log();
            console.error(chalk_1.default.red(error));
        }
    }
}
module.exports = new PluginGeneratorClass();
