import { SubGenerator } from "../sub-generator";
import { Tools as CoreTools, ToolsCheckPath as CoreToolsCheckPath } from '../../../core/includes/tools';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import glob from 'glob';

class MockRoutesGeneratorClass extends SubGenerator {
    //
    // Public methods.
    public load(program: any): void {
        program
            .command(`mock-routes <directory>`)
            .alias(`mr`)
            .description(`generates a mock-up routes configuration based on the contents of a directory.`)
            .option(`-c, --config-name [name]`,
                `name of the config file to generate.`)
            .option(`--test-run`,
                `does almost everything except actually generate files.`)
            .action((directory: any, options: any) => {
                this.generate(directory, options);
                process.exit();
            });
    }
    //
    // Protected methods.
    protected generate(directory: string, options: any): void {
        let error: string | null = null;

        let cleanOptions: any = {
            configName: options.configName ? options.configName : 'routes.json',
            configPath: null,
            testRun: options.testRun == true
        };
        cleanOptions.configName += cleanOptions.configName.match(/\.json$/) ? '' : '.json';

        console.log(`Generating a mock-up routes`);
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
            cleanOptions.configPath = path.join(directory, cleanOptions.configName);
            console.log(`\tConfiguration file: '${chalk.green(cleanOptions.configPath)}'`);
        }

        let routes: { uri: string; path: string; }[] = [];
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
            for (const r of routes) {
                console.log(`\t\t- '${chalk.green(r.uri)}' (file: '${chalk.magenta(r.path)}')`);
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
                } catch (err) {
                    console.error(chalk.red(`${err}`));
                }
            }
        }

        if (error) {
            console.log();
            console.error(chalk.red(error));
        }
    }
}

export = new MockRoutesGeneratorClass();
