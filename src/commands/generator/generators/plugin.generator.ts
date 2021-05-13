import { PluginsConstants } from '../../../core/plugins';
import { SubGenerator } from "../sub-generator";
import { TAB } from '../../../core/includes';
import { Tools as CoreTools, ToolsCheckPath as CoreToolsCheckPath } from '../../../core/includes/tools';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ejs from 'ejs';

class PluginGeneratorClass extends SubGenerator {
    //
    // Public methods.
    public load(program: any): void {
        program
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
                this.generate(name, directory, options);
                process.exit();
            });
    }
    //
    // Protected methods.
    protected generate(name: string, directory: string, options: any): void {
        let error: string | null = null;

        let cleanOptions: any = {
            configs: options.configs ? options.configs : null,
            force: options.force == true,
            testRun: options.testRun == true
        };

        console.log(`Generating plugin`);
        console.log(`${TAB}Name:              '${chalk.green(name)}'`);
        //
        // Checking plugins directory.
        if (!error) {
            const check = CoreTools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case CoreToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case CoreToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        cleanOptions.pluginDirectory = path.join(directory, name);
        cleanOptions.pluginIndex = path.join(cleanOptions.pluginDirectory, 'index.js');
        console.log(`${TAB}Working directory: '${chalk.green(directory)}'`);
        console.log(`${TAB}Plugin directory:  '${chalk.green(cleanOptions.pluginDirectory)}'`);
        //
        // Checking configurations directory.
        if (!error && cleanOptions.configs) {
            const check = CoreTools.CheckDirectory(cleanOptions.configs, process.cwd());
            switch (check.status) {
                case CoreToolsCheckPath.Ok:
                    cleanOptions.configs = check.path;
                    break;
                case CoreToolsCheckPath.WrongType:
                    error = `'${cleanOptions.configs}' is not a directory.`;
                    break;
                default:
                    error = `'${cleanOptions.configs}' is not a valid path.`;
                    break;
            }
        }
        if (!error && cleanOptions.configs) {
            cleanOptions.configFile = path.join(cleanOptions.configs, `${PluginsConstants.ConfigsPrefix}${name}.json`);

            console.log(`${TAB}Configs directory: '${chalk.green(cleanOptions.configs)}'`);
            console.log(`${TAB}Config file:       '${chalk.green(cleanOptions.configFile)}'`);
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
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../../assets/template.plugin-index.ejs')).toString();
                        fs.writeFileSync(cleanOptions.pluginIndex, ejs.render(template, {
                            name,
                            defaultMethod: PluginsConstants.DefaultMethod,
                            globalConstant: PluginsConstants.GlobalConfigPointer
                        }, {}));
                    } catch (err) {
                        console.error(chalk.red(`${err}`));
                    }
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
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../../assets/template.plugin-config.ejs')).toString();
                        fs.writeFileSync(cleanOptions.configFile, ejs.render(template, {
                            name,
                            defaultMethod: PluginsConstants.DefaultMethod,
                            globalConstant: PluginsConstants.GlobalConfigPointer
                        }, {}));
                    } catch (err) {
                        console.error(chalk.red(`${err}`));
                    }
                }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
}

export = new PluginGeneratorClass();
