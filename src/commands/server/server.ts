/**
 * @file server.ts
 * @author Alejandro D. Simi
 */
import { Command, OptionValues } from 'commander';
import { ConfigsConstants, ConfigsManager, EndpointsManager, ExpressConnector, IEndpointOptions, LoadersManager, MiddlewaresManager, MockRoutesManager, RoutesManager, TasksManager } from '../../core/drtools';
import { Tools } from '../includes/tools';
import * as http from 'http';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';

export class DRToolsServer {
    //
    // Protected methods.
    protected availableUrls: any[] = [];
    protected chalkForMethods: any = {
        DELETE: chalk.red,
        GET: chalk.green,
        POST: chalk.red,
        PUT: chalk.yellow,
        PATCH: chalk.yellow
    };
    protected connectorOptions: any = {
        verbose: true
    };
    protected error: string | null = null;
    protected port: boolean = false;
    protected program = new Command();
    protected webUI: boolean = true;
    //
    // Public methods.
    public async run(): Promise<void> {
        this.setAndLoadArguments();
        this.parseArguments();
        if (!this.error) {
            await this.startServer();
        } else {
            console.error(chalk.red(this.error));
        }
    }
    //
    // Protected methods.
    protected promptHeader(): void {
        console.log(`DRTools Server (v${Tools.Instance().version()}):`);
    }
    protected parseArguments(): void {
        const options: OptionValues = this.program.opts();
        this.port = options.port || 3005;
        //
        // Analyzing parameters for the Configs manager.
        if (options.configs) {
            this.connectorOptions.configsDirectory = Tools.CompletePath(options.configs);
            this.connectorOptions.configsOptions = {};

            this.availableUrls.push(ConfigsConstants.PublishUri);
            this.connectorOptions.configsOptions.publishConfigs = ConfigsConstants.PublishUri;

            if (options.configsSuffix) {
                this.connectorOptions.configsOptions.suffix = options.configsSuffix;
            }
        } else if (options.configsSuffix) {
            this.error = `Parameter '--configs-suffix' should be used along with option '--configs'.`;
        }
        //
        // Analyzing parameters for the Loaders manager.
        if (options.loaders) {
            this.connectorOptions.loadersDirectory = Tools.CompletePath(options.loaders);

            if (options.loadersSuffix) {
                this.connectorOptions.loadersOptions = { suffix: options.loadersSuffix };
            }
        } else if (options.loadersSuffix) {
            this.error = `Parameter '--loaders-suffix' should be used along with option '--loaders'.`;
        }
        //
        // Analyzing parameters for the Middlewares manager.
        if (options.middlewares) {
            this.connectorOptions.middlewaresDirectory = Tools.CompletePath(options.middlewares);

            if (options.middlewaresSuffix) {
                this.connectorOptions.middlewaresOptions = { suffix: options.middlewaresSuffix };
            }
        } else if (options.middlewaresSuffix) {
            this.error = `Parameter '--middlewares-suffix' should be used along with option '--middlewares'.`;
        }
        //
        // Analyzing parameters for the Routes manager.
        if (options.routes) {
            this.connectorOptions.routesDirectory = Tools.CompletePath(options.routes);

            if (options.routesSuffix) {
                this.connectorOptions.routesOptions = { suffix: options.routesSuffix };
            }
        } else if (options.routesSuffix) {
            this.error = `Parameter '--routes-suffix' should be used along with option '--routes'.`;
        }
        //
        // Analyzing parameters for the Tasks manager.
        if (options.tasks) {
            this.connectorOptions.tasksDirectory = Tools.CompletePath(options.tasks);

            if (options.tasksSuffix) {
                this.connectorOptions.tasksOptions = { suffix: options.tasksSuffix };
            }
        } else if (options.tasksSuffix) {
            this.error = `Parameter '--tasks-suffix' should be used along with option '--tasks'.`;
        }
        //
        // Analyzing parameters for the Mockup Routes manager.
        if (options.mockRoutes) {
            this.connectorOptions.mockRoutesConfig = Tools.CompletePath(options.mockRoutes);
        }
        //
        // Analyzing parameters for the Mock-up Endpoints manager.
        if (options.endpoint && options.endpointDirectory) {
            const uri = options.endpoint[0] === '/' ? options.endpoint : `/${options.endpoint}`;
            this.connectorOptions.endpoints = {
                uri,
                directory: Tools.CompletePath(options.endpointDirectory),
                options: {
                    globalBehaviors: []
                }
            };

            if (options.endpointBehaviors) {
                options.endpointBehaviors.split(',')
                    .forEach((b: string) => {
                        this.connectorOptions.endpoints.options.globalBehaviors.push(Tools.CompletePath(b));
                    });
            }

            this.availableUrls.push(uri);
        } else if (options.endpoint) {
            this.error = `Parameter '--endpoint' should be used along with option '--endpoint-directory'.`;
        } else if (options.endpointDirectory) {
            this.error = `Parameter '--endpoint-directory' should be used along with option '--endpoint'.`;
        } else if (options.endpointBehaviors && !options.endpoint) {
            this.error = `Parameter '--endpoint-behaviors' should be used along with option '--endpoint'.`;
        }
        //
        // Analyzing parameters for web-ui activation.
        this.connectorOptions.webUi = this.webUI = options.ui;
        if (this.webUI) {
            this.availableUrls.push('/.drtools');
        }

        if (!this.error && Object.keys(this.connectorOptions).length === 2) {
            this.error = `There's nothing to serve.`;
        }
    }
    protected setAndLoadArguments(): void {
        this.program
            .version(Tools.Instance().version(), '-v, --version')
            .option('-c, --configs [path]',
                'directory where configuration files are stored.')
            .option('-e, --endpoint [uri]',
                'URL where to provide an endpoint mock-up.')
            .option('-E, --endpoint-directory [path]',
                'directory where endpoint mock-up files are stored.')
            .option('-l, --loaders [path]',
                'directory where initialization files are stored.')
            .option('-m, --middlewares [path]',
                'directory where middleware files are stored.')
            .option('-p, --port [port-number]',
                'port number (default is 3005).')
            .option('-r, --routes [path]',
                'directory where route files are stored.')
            .option('-R, --mock-routes [path]',
                'configuration file for mock-up routes.')
            .option('-t, --tasks [path]',
                'directory where task files are stored.')
            .option('--configs-suffix [suffix]',
                'expected extension on configuration files.')
            .option('--endpoint-behaviors [path]',
                'path to a behavior script for endpoint mock-up.')
            .option('--loaders-suffix [suffix]',
                'expected extension on initialization files.')
            .option('--middlewares-suffix [suffix]',
                'expected extension on middleware files.')
            .option('--no-ui',
                'do not load internal WebUI.')
            .option('--routes-suffix [suffix]',
                'expected extension on route files.')
            .option('--tasks-suffix [suffix]',
                'expected extension on task files.')
            .option('--test-run',
                'does almost everything except start the server and listen its port.')
            .outputHelp((text: string) => {
                this.promptHeader();
                return '';
            });

        this.program.parse(process.argv);
    }
    protected async startServer(): Promise<void> {
        let configs: ConfigsManager | null = null;
        let loaders: LoadersManager | null = null;
        let middlewares: MiddlewaresManager | null = null;
        let routes: RoutesManager | null = null;
        let tasks: TasksManager | null = null;
        let mockRoutes: MockRoutesManager | null = null;
        let endpoints: EndpointsManager | null = null;

        const exitHandler = (options: any, err: any) => {
            process.exit();
        }
        const listingInfo = () => {
            console.log(`\nListening at '${chalk.green(`http://localhost:${this.port}`)}'`);

            if (configs && this.connectorOptions.configsDirectory) {
                const error = configs.valid() ? '' : chalk.yellow(` (Error: ${configs.lastError()})`);
                const suffix = this.connectorOptions.configsOptions && this.connectorOptions.configsOptions.suffix ? ` (suffix: '.${this.connectorOptions.configsOptions.suffix}')` : '';
                console.log(`\t- Configuration files at '${chalk.green(this.connectorOptions.configsDirectory)}'${suffix}${error}`);
            }

            if (loaders && this.connectorOptions.loadersDirectory) {
                const error = loaders.valid() ? '' : chalk.yellow(` (Error: ${loaders.lastError()})`);
                const suffix = this.connectorOptions.loadersOptions && this.connectorOptions.loadersOptions.suffix ? ` (suffix: '.${this.connectorOptions.loadersOptions.suffix}')` : '';
                console.log(`\t- Initialization files at '${chalk.green(this.connectorOptions.loadersDirectory)}'${suffix}${error}`);
            }

            if (middlewares && this.connectorOptions.middlewaresDirectory) {
                const error = middlewares.valid() ? '' : chalk.yellow(` (Error: ${middlewares.lastError()})`);
                const suffix = this.connectorOptions.middlewaresOptions && this.connectorOptions.middlewaresOptions.suffix ? ` (suffix: '.${this.connectorOptions.middlewaresOptions.suffix}')` : '';
                console.log(`\t- Middleware files at '${chalk.green(this.connectorOptions.middlewaresDirectory)}'${suffix}${error}`);
            }

            if (routes && this.connectorOptions.routesDirectory) {
                const error = routes.valid() ? '' : chalk.yellow(` (Error: ${routes.lastError()})`);
                const suffix = this.connectorOptions.routesOptions && this.connectorOptions.routesOptions.suffix ? ` (suffix: '.${this.connectorOptions.routesOptions.suffix}')` : '';
                console.log(`\t- Route files at '${chalk.green(this.connectorOptions.routesDirectory)}'${suffix}${error}`);
            }

            if (tasks && this.connectorOptions.tasksDirectory) {
                const error = tasks.valid() ? '' : chalk.yellow(` (Error: ${tasks.lastError()})`);
                const suffix = this.connectorOptions.tasksOptions && this.connectorOptions.tasksOptions.suffix ? ` (suffix: '.${this.connectorOptions.tasksOptions.suffix}')` : '';
                console.log(`\t- Task files at '${chalk.green(this.connectorOptions.tasksDirectory)}'${suffix}${error}`);
            }

            if (mockRoutes && mockRoutes) {
                const error = mockRoutes.valid() ? '' : chalk.yellow(` (Error: ${mockRoutes.lastError()})`);
                console.log(`\t- Mock-up routes configuration '${chalk.green(mockRoutes.configPath())}'${error}`);
            }

            if (endpoints && this.connectorOptions.endpoints) {
                const error = endpoints.valid() ? '' : chalk.yellow(` (Error: ${endpoints.lastError()})`);

                console.log(`\t- Mock-up Endpoint${error}`);
                console.log(`\t\tURI:       '${chalk.green(endpoints.uri())}'`);
                console.log(`\t\tDirectory: '${chalk.green(endpoints.directory())}'`);
                const options: IEndpointOptions | null = endpoints.options();
                if (options && options.globalBehaviors && options.globalBehaviors.length > 0) {
                    console.log(`\t\tBehaviors:`);
                    (<string[]>options.globalBehaviors).forEach((b: string) => console.log(`\t\t\t'${chalk.green(b)}'`));
                }
            }

            if (this.webUI) {
                console.log(`WebUI at '${chalk.green(`http://localhost:${this.port}/.drtools`)}'`);
            }

            console.log();
        };

        try {
            const app = express();

            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: false }));

            app.use((req: any, res: any, next: () => void) => {
                if (this.chalkForMethods[req.method] !== undefined) {
                    console.log(`${this.chalkForMethods[req.method](`[${req.method}]`)}: ${chalk.cyan(req.originalUrl)}`);
                } else {
                    console.log(`[${chalk.cyan(req.method)}]: ${chalk.cyan(req.originalUrl)}`);
                }
                next();
            });

            ExpressConnector.attach(app, { webUi: this.webUI });

            if (this.connectorOptions.configsDirectory) {
                configs = new ConfigsManager(this.connectorOptions.configsDirectory, this.connectorOptions.configsOptions);
            }

            if (this.connectorOptions.loadersDirectory) {
                loaders = new LoadersManager(this.connectorOptions.loadersDirectory, this.connectorOptions.loadersOptions, configs);
                await loaders.load();
            }

            if (this.connectorOptions.middlewaresDirectory) {
                middlewares = new MiddlewaresManager(app, this.connectorOptions.middlewaresDirectory, this.connectorOptions.middlewaresOptions, configs);
                await middlewares.load();
            }

            if (configs && this.connectorOptions.routesDirectory) {
                routes = new RoutesManager(app, this.connectorOptions.routesDirectory, this.connectorOptions.routesOptions, configs);
                await routes.load();
            }
            if (routes) {
                for (const r of routes.itemNames()) {
                    this.availableUrls.push(`/${r}`);
                }
            }

            if (configs && this.connectorOptions.tasksDirectory) {
                tasks = new TasksManager(this.connectorOptions.tasksDirectory, this.connectorOptions.tasksOptions, configs);
                await tasks.load();
            }

            if (this.connectorOptions.mockRoutesConfig) {
                mockRoutes = new MockRoutesManager(app, this.connectorOptions.mockRoutesConfig, {}, configs);
            }

            if (this.connectorOptions.endpoints) {
                endpoints = new EndpointsManager({
                    directory: this.connectorOptions.endpoints.directory,
                    uri: this.connectorOptions.endpoints.uri,
                    options: this.connectorOptions.endpoints.options
                }, configs);
                app.use(endpoints.provide());
            }


            app.all('*', (req: any, res: any) => {
                const result: any = {
                    message: `Path '${req.url}' was not found.`
                };

                if (req.originalUrl === '/') {
                    result.availableUrls = this.availableUrls.sort();
                }

                res.status(404).json(result);
            });

            if (this.program.opts().testRun) {
                listingInfo();
            } else {
                http.createServer(app).listen(this.port, listingInfo);
            }
        } catch (err) {
            console.error(chalk.red(`There was an error loading managers.`), err);
        }
        //
        // Do something when app is closing.
        process.on('exit', exitHandler.bind(null, { cleanup: true }));
        //
        // Catches ctrl+c event
        process.on('SIGINT', exitHandler.bind(null, { exit: true }));
        //
        // Catches "kill pid" (for example: nodemon restart).
        process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
        process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
        //
        // Catches uncaught exceptions.
        process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
    }
}
