"use strict";
const tslib_1 = require("tslib");
const middlewares_1 = require("../../../core/middlewares");
const sub_generator_1 = require("../sub-generator");
const tools_1 = require("../../../core/includes/tools");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ejs_1 = tslib_1.__importDefault(require("ejs"));
class MiddlewareGeneratorClass extends sub_generator_1.SubGenerator {
    //
    // Public methods.
    load(program) {
        program
            .command(`middleware <name> <directory>`)
            .alias(`m`)
            .description(`generates a middleware with an initial structure.`)
            .option(`-f, --force`, `in case the destination file exists, this option forces its replacement.`)
            .option(`-k, --koa`, `creates a template for configurations using KoaJS.`)
            .option(`-s, --suffix [suffix]`, `suffix to use when generating a file (default: '${middlewares_1.MiddlewaresConstants.Suffix}').`)
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
            force: options.force == true,
            suffix: options.suffix ? options.suffix : middlewares_1.MiddlewaresConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;
        console.log(`Generating middleware`);
        console.log(`\tWorking directory:  '${chalk_1.default.green(directory)}'`);
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
            console.log(`\tMiddleware file: '${chalk_1.default.green(cleanOptions.fullPath)}'`);
        }
        if (!error) {
            console.log(`Generating middleware file...`);
            if (!cleanOptions.testRun) {
                const exists = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const templatePath = options.koa
                            ? path.join(__dirname, '../../../../assets/template.middleware.koa.ejs')
                            : path.join(__dirname, '../../../../assets/template.middleware.ejs');
                        const template = fs.readFileSync(templatePath).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs_1.default.render(template, {
                            name,
                            globalConstant: middlewares_1.MiddlewaresConstants.GlobalConfigPointer
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
module.exports = new MiddlewareGeneratorClass();
