"use strict";
const tslib_1 = require("tslib");
const sub_generator_1 = require("../sub-generator");
const includes_1 = require("../../../core/includes");
const tasks_1 = require("../../../core/tasks");
const tools_1 = require("../../../core/includes/tools");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ejs_1 = tslib_1.__importDefault(require("ejs"));
class TaskGeneratorClass extends sub_generator_1.SubGenerator {
    //
    // Public methods.
    load(program) {
        program
            .command(`task <name> <directory>`)
            .alias(`t`)
            .description(`generates a task with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-i, --interval [number]`, `task interval in milliseconds (default: 2 minute).`)
            .option(`-r, --run-on-start`, `whether the task should run on start or not (default: false).`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${tasks_1.TasksConstants.Suffix}').`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .option(`-ts, --typescript`, `generates a typescript compatible task.`)
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
            force: options.force == true,
            interval: options.interval ? options.interval : 120000,
            runOnStart: options.runOnStart ? 'true' : 'false',
            suffix: options.suffix ? options.suffix : tasks_1.TasksConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.${options.typescript ? 't' : 'j'}s`;
        console.log(`Generating task`);
        console.log(`${includes_1.TAB}Working directory:  '${chalk_1.default.green(directory)}'`);
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
        if (!error) {
            cleanOptions.fullPath = path.join(directory, cleanOptions.fullName);
            console.log(`${includes_1.TAB}Task file: '${chalk_1.default.green(cleanOptions.fullPath)}'`);
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
                        const asset = options.typescript ? 'template.task.ts.ejs' : 'template.task.ejs';
                        const template = fs.readFileSync(path.join(__dirname, '../../../../assets', asset)).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs_1.default.render(template, {
                            interval: cleanOptions.interval,
                            name,
                            properClassName,
                            properName,
                            runOnStart: cleanOptions.runOnStart
                        }, {}));
                    }
                    catch (err) {
                        console.error(chalk_1.default.red(`${err}`));
                    }
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
}
module.exports = new TaskGeneratorClass();
