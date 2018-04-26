/**
 * @file generator.ts
 * @author Alejandro D. Simi
 */

import { chalk, commander, fs, glob, path } from '../../libraries';

import {
    ConfigsConstants,
    EndpointOptions,
    ExpressConnector
} from '../../core/drtools';
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
    }
    //
    // Protected methods.
    protected promptHeader(): void {
        console.log(`DRTools Generator (v${Tools.Instance().version()}):\n`);
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
            .action((cmd: any, options: any) => {
                this.promptHeader();

                console.error(chalk.red(`No valid command specified.`));
                commander.help();
            });
    }
}
