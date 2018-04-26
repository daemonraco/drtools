/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */

import { chalk, commander, ejs, fs, glob, path } from '../../libraries';

import { RoutesConstants } from '../../core/drtools';
import { Tools } from '../includes/tools';

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

        if (commander.options.length <= 1 && commander.commands.length <= 1) {
            this.promptHeader();
            commander.help();
        }
    }
    //
    // Protected methods.
    protected promptHeader(): void {
        console.log(`DRTools Generator (v${Tools.Instance().version()}):`);
    }
    protected generateRoute(name: string, directory: string, options: any): void {
        let error: string = null;

        this.promptHeader();

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
            console.log(`Generating configuration file...`);
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

        this.promptHeader();

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
    protected setCommands(): void {
        commander
            .version(Tools.Instance().version(), '-v, --version')

        commander
            .command('mock-routes <directory>')
            .alias('mr')
            .description('generates a mock-up routes configuration based on the contents of a directory.')
            .option('-c, --config-name [name]',
                'name of the config file to generate.')
            .option('--test-run',
                'does almost everything except actually generate files.')
            .action((directory: any, options: any) => {
                this.generateMockUpRoutes(directory, options);
            });

        commander
            .command('route <name> <directory>')
            .alias('r')
            .description('generates a route with an initial structure.')
            .option('-f, --force',
                'in case the destination file exists, this option forces its replacement.')
            .option('-s, --suffix [suffix]',
                'suffix to use when generating a file.')
            .option('--test-run',
                'does almost everything except actually generate files.')
            .action((name: any, directory: any, options: any) => {
                this.generateRoute(name, directory, options);
            });

        commander
            .action((cmd: any, options: any) => {
                this.promptHeader();
                console.error(chalk.red(`\nNo valid command specified.`));
                commander.help();
            });
    }
}
