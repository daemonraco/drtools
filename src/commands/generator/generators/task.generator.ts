import { SubGenerator } from "../sub-generator";
import { TAB } from "../../../core/includes";
import { TasksConstants } from '../../../core/tasks';
import { Tools as CoreTools, ToolsCheckPath as CoreToolsCheckPath } from '../../../core/includes/tools';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ejs from 'ejs';

class TaskGeneratorClass extends SubGenerator {
    //
    // Public methods.
    public load(program: any): void {
        program
            .command(`task <name> <directory>`)
            .alias(`t`)
            .description(`generates a task with an initial structure.`)
            .option(`-f, --force`,
                `in case the destination file exists, this option forces its replacement.`)
            .option(`-i, --interval [number]`,
                `task interval in milliseconds (default: 2 minute).`)
            .option(`-r, --run-on-start`,
                `whether the task should run on start or not (default: false).`)
            .option(`-s, --suffix [suffix]`,
                `suffix to use when generating a file (default: '${TasksConstants.Suffix}').`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .option(`-ts, --typescript`,
                `generates a typescript compatible task.`)
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
            force: options.force == true,
            interval: options.interval ? options.interval : 120000,
            runOnStart: options.runOnStart ? 'true' : 'false',
            suffix: options.suffix ? options.suffix : TasksConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.${options.typescript ? 't' : 'j'}s`;

        console.log(`Generating task`);
        console.log(`${TAB}Working directory:  '${chalk.green(directory)}'`);

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

        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`${TAB}Task file: '${chalk.green(cleanOptions.fullPath)}'`);
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
                        const asset: string = options.typescript ? 'template.task.ts.ejs' : 'template.task.ejs';
                        const template: string = fs.readFileSync(path.join(__dirname, '../../../../assets', asset)).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs.render(template, {
                            interval: cleanOptions.interval,
                            name,
                            properClassName,
                            properName,
                            runOnStart: cleanOptions.runOnStart
                        }, {}));
                    } catch (err) {
                        console.error(chalk.red(`${err}`));
                    }
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
}

export = new TaskGeneratorClass();
