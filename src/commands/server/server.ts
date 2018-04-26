/**
 * @file server.ts
 * @author Alejandro D. Simi
 */

import { bodyParser, chalk, commander, express, fs, glob, http, path } from '../../libraries';

import { ServerVariables } from './variables';
import { Tools } from '../includes/tools';

import {
    ConfigsConstants,
    EndpointOptions,
    ExpressConnector
} from '../../core/drtools';

declare const process: any;

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
    protected error: string = null;
    protected port: boolean = false;
    protected webUI: boolean = true;
    //
    // Public methods.
    public run(): void {
        console.log(`DRTools Server (v${Tools.Instance().version()}):\n`);
        //
        // Running @{
        this.setAndLoadArguments();
        this.parseArguments();
        if (!this.error) {
            this.startServer();
        } else {
            console.error(chalk.red(this.error));
        }
        // @}
    }
    //
    // Protected methods.
    protected setAndLoadArguments(): void {
        commander
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
                'Configuration file for mock-up routes.')
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
            .parse(process.argv);
    }
    protected parseArguments(): void {
        this.port = commander.port || 3005;

        if (commander.configs) {
            this.connectorOptions.configsDirectory = path.join(process.cwd(), commander.configs);
            this.availableUrls.push(ConfigsConstants.PublishUri);

            if (commander.configsSuffix) {
                this.connectorOptions.configsOptions = { suffix: commander.configsSuffix };
            }
        } else if (commander.configsSuffix) {
            this.error = `Parameter '--configs-suffix' should be used along with option '--configs'.`;
        }

        if (commander.loaders) {
            this.connectorOptions.loadersDirectory = path.join(process.cwd(), commander.loaders);

            if (commander.loadersSuffix) {
                this.connectorOptions.loadersOptions = { suffix: commander.loadersSuffix };
            }
        } else if (commander.loadersSuffix) {
            this.error = `Parameter '--loaders-suffix' should be used along with option '--loaders'.`;
        }

        if (commander.middlewares) {
            this.connectorOptions.middlewaresDirectory = path.join(process.cwd(), commander.middlewares);

            if (commander.middlewaresSuffix) {
                this.connectorOptions.middlewaresOptions = { suffix: commander.middlewaresSuffix };
            }
        } else if (commander.middlewaresSuffix) {
            this.error = `Parameter '--middlewares-suffix' should be used along with option '--middlewares'.`;
        }

        if (commander.routes) {
            this.connectorOptions.routesDirectory = path.join(process.cwd(), commander.routes);

            if (commander.routesSuffix) {
                this.connectorOptions.routesOptions = { suffix: commander.routesSuffix };
            }
        } else if (commander.routesSuffix) {
            this.error = `Parameter '--routes-suffix' should be used along with option '--routes'.`;
        }

        if (commander.tasks) {
            this.connectorOptions.tasksDirectory = path.join(process.cwd(), commander.tasks);

            if (commander.tasksSuffix) {
                this.connectorOptions.tasksOptions = { suffix: commander.tasksSuffix };
            }
        } else if (commander.tasksSuffix) {
            this.error = `Parameter '--tasks-suffix' should be used along with option '--tasks'.`;
        }

        if (commander.mockRoutes) {
            this.connectorOptions.mockRoutesConfig = path.join(process.cwd(), commander.mockRoutes);
        }

        if (commander.endpoint && commander.endpointDirectory) {
            const uri = commander.endpoint[0] === '/' ? commander.endpoint : `/${commander.endpoint}`;
            this.connectorOptions.endpoints = {
                uri,
                directory: path.join(process.cwd(), commander.endpointDirectory),
                options: {
                    globalBehaviors: []
                }
            };

            if (commander.endpointBehaviors) {
                commander.endpointBehaviors.split(',')
                    .forEach((b: string) => {
                        this.connectorOptions.endpoints.options.globalBehaviors.push(path.join(process.cwd(), b));
                    });
            }

            this.availableUrls.push(uri);
        } else if (commander.endpoint) {
            this.error = `Parameter '--endpoint' should be used along with option '--endpoint-directory'.`;
        } else if (commander.endpointDirectory) {
            this.error = `Parameter '--endpoint-directory' should be used along with option '--endpoint'.`;
        } else if (commander.endpointBehaviors && !commander.endpoint) {
            this.error = `Parameter '--endpoint-behaviors' should be used along with option '--endpoint'.`;
        }

        this.connectorOptions.webUi = this.webUI = commander.ui;
        if (this.webUI) {
            this.availableUrls.push('/.drtools');
        }
        // @}

        if (!this.error && Object.keys(this.connectorOptions).length === 2) {
            this.error = `There's nothing to serve.`;
        }
    }
    protected startServer(): void {
        const app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        app.use((req: any, res: any, next: () => void) => {
            if (typeof this.chalkForMethods[req.method] !== 'undefined') {
                console.log(`${this.chalkForMethods[req.method](`[${req.method}]`)}: ${chalk.cyan(req.originalUrl)}`);
            } else {
                console.log(`[${chalk.cyan(req.method)}]: ${chalk.cyan(req.originalUrl)}`);
            }
            next();
        });

        const connecterResults = ExpressConnector.attach(app, this.connectorOptions);
        const { configs, endpoints, loaders, middlewares, mockRoutes, routes, tasks } = connecterResults;
        if (routes) {
            routes.itemNames().forEach((r: string) => this.availableUrls.push(`/${r}`));
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

        const listingInfo = () => {
            console.log(`\nListening at '${chalk.green(`http://localhost:${this.port}`)}'`);

            if (this.connectorOptions.configsDirectory) {
                const error = configs.valid() ? '' : chalk.yellow(` (Error: ${configs.lastError()})`);
                const suffix = this.connectorOptions.configsOptions && this.connectorOptions.configsOptions.suffix ? ` (suffix: '.${this.connectorOptions.configsOptions.suffix}')` : '';
                console.log(`\t- Configuration files at '${chalk.green(this.connectorOptions.configsDirectory)}'${suffix}${error}`);
            }

            if (this.connectorOptions.loadersDirectory) {
                const error = loaders.valid() ? '' : chalk.yellow(` (Error: ${loaders.lastError()})`);
                const suffix = this.connectorOptions.loadersOptions && this.connectorOptions.loadersOptions.suffix ? ` (suffix: '.${this.connectorOptions.loadersOptions.suffix}')` : '';
                console.log(`\t- Initialization files at '${chalk.green(this.connectorOptions.loadersDirectory)}'${suffix}${error}`);
            }

            if (this.connectorOptions.middlewaresDirectory) {
                const error = middlewares.valid() ? '' : chalk.yellow(` (Error: ${middlewares.lastError()})`);
                const suffix = this.connectorOptions.middlewaresOptions && this.connectorOptions.middlewaresOptions.suffix ? ` (suffix: '.${this.connectorOptions.middlewaresOptions.suffix}')` : '';
                console.log(`\t- Middleware files at '${chalk.green(this.connectorOptions.middlewaresDirectory)}'${suffix}${error}`);
            }

            if (this.connectorOptions.routesDirectory) {
                const error = routes.valid() ? '' : chalk.yellow(` (Error: ${routes.lastError()})`);
                const suffix = this.connectorOptions.routesOptions && this.connectorOptions.routesOptions.suffix ? ` (suffix: '.${this.connectorOptions.routesOptions.suffix}')` : '';
                console.log(`\t- Route files at '${chalk.green(this.connectorOptions.routesDirectory)}'${suffix}${error}`);
            }

            if (this.connectorOptions.tasksDirectory) {
                const error = tasks.valid() ? '' : chalk.yellow(` (Error: ${tasks.lastError()})`);
                const suffix = this.connectorOptions.tasksOptions && this.connectorOptions.tasksOptions.suffix ? ` (suffix: '.${this.connectorOptions.tasksOptions.suffix}')` : '';
                console.log(`\t- Task files at '${chalk.green(this.connectorOptions.tasksDirectory)}'${suffix}${error}`);
            }

            if (mockRoutes) {
                const error = mockRoutes.valid() ? '' : chalk.yellow(` (Error: ${mockRoutes.lastError()})`);
                console.log(`\t- Mock-up routes configuration '${chalk.green(mockRoutes.configPath())}'${error}`);
            }

            if (this.connectorOptions.endpoints) {
                endpoints.forEach(endpoint => {
                    const error = endpoint.valid() ? '' : chalk.yellow(` (Error: ${endpoint.lastError()})`);

                    console.log(`\t- Mock-up Endpoint${error}`);
                    console.log(`\t\tURI:       '${chalk.green(endpoint.uri())}'`);
                    console.log(`\t\tDirectory: '${chalk.green(endpoint.directory())}'`);
                    const options: EndpointOptions = endpoint.options();
                    if (options.globalBehaviors.length > 0) {
                        console.log(`\t\tBehaviors:`);
                        (<string[]>options.globalBehaviors).forEach((b: string) => console.log(`\t\t\t'${chalk.green(b)}'`));
                    }
                });
            }

            if (this.webUI) {
                console.log(`WebUI at '${chalk.green(`http://localhost:${this.port}/.drtools`)}'`);
            }

            console.log();
        };

        if (commander.testRun) {
            listingInfo();
        } else {
            http.createServer(app).listen(this.port, listingInfo);
        }

        const exitHandler = (options: any, err: any) => {
            process.exit();
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
