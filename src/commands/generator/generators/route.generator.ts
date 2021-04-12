import { RoutesConstants } from '../../../core/routes';
import { SubGenerator } from "../sub-generator";
import { Tools as CoreTools, ToolsCheckPath as CoreToolsCheckPath } from '../../../core/includes/tools';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import ejs from 'ejs';

class RouteGeneratorClass extends SubGenerator {
    //
    // Public methods.
    public load(program: any): void {
        program
            .command(`route <name> <directory>`)
            .alias(`r`)
            .description(`generates a route with an initial structure.`)
            .option(`-f, --force`,
                `in case the destination file exists, this option forces its replacement.`)
            .option(`-k, --koa`,
                `creates a template for configurations using KoaJS.`)
            .option(`-s, --suffix [suffix]`,
                `suffix to use when generating a file (default: '${RoutesConstants.Suffix}').`)
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
            force: options.force == true,
            suffix: options.suffix ? options.suffix : RoutesConstants.Suffix,
            testRun: options.testRun == true
        };
        cleanOptions.fullName = `${name}.${cleanOptions.suffix}.js`;

        console.log(`Generating route`);
        console.log(`\tWorking directory:  '${chalk.green(directory)}'`);

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
            console.log(`\tRoute file: '${chalk.green(cleanOptions.fullPath)}'`);
        }

        if (!error) {
            console.log(`Generating route file...`);
            if (!cleanOptions.testRun) {
                const exists: boolean = fs.existsSync(cleanOptions.fullPath);
                if (cleanOptions.force || !exists) {
                    try {
                        const templatePath: string = options.koa
                            ? path.join(__dirname, '../../../../assets/template.route.koa.ejs')
                            : path.join(__dirname, '../../../../assets/template.route.ejs');
                        const template: string = fs.readFileSync(templatePath).toString();
                        fs.writeFileSync(cleanOptions.fullPath, ejs.render(template, {
                            name,
                            globalConstant: RoutesConstants.GlobalConfigPointer
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

export = new RouteGeneratorClass();
