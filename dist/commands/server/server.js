"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRToolsServer = void 0;
const tslib_1 = require("tslib");
/**
 * @file server.ts
 * @author Alejandro D. Simi
 */
const commander_1 = require("commander");
const drtools_1 = require("../../core/drtools");
const tools_1 = require("../includes/tools");
const http = tslib_1.__importStar(require("http"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const express_1 = tslib_1.__importDefault(require("express"));
class DRToolsServer {
    constructor() {
        //
        // Protected methods.
        this.availableUrls = [];
        this.chalkForMethods = {
            DELETE: chalk_1.default.red,
            GET: chalk_1.default.green,
            POST: chalk_1.default.red,
            PUT: chalk_1.default.yellow,
            PATCH: chalk_1.default.yellow
        };
        this.connectorOptions = {
            verbose: true
        };
        this.error = null;
        this.port = false;
        this.program = new commander_1.Command();
        this.webUI = true;
    }
    //
    // Public methods.
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.setAndLoadArguments();
            this.parseArguments();
            if (!this.error) {
                yield this.startServer();
            }
            else {
                console.error(chalk_1.default.red(this.error));
            }
        });
    }
    //
    // Protected methods.
    parseArguments() {
        const options = this.program.opts();
        this.port = options.port || 3005;
        //
        // Analyzing parameters for the Configs manager.
        if (options.configs) {
            this.connectorOptions.configsDirectory = tools_1.Tools.CompletePath(options.configs);
            this.connectorOptions.configsOptions = {};
            this.availableUrls.push(drtools_1.ConfigsConstants.PublishUri);
            this.connectorOptions.configsOptions.publishConfigs = drtools_1.ConfigsConstants.PublishUri;
            if (options.configsSuffix) {
                this.connectorOptions.configsOptions.suffix = options.configsSuffix;
            }
        }
        else if (options.configsSuffix) {
            this.error = `Parameter '--configs-suffix' should be used along with option '--configs'.`;
        }
        //
        // Analyzing parameters for the Loaders manager.
        if (options.loaders) {
            this.connectorOptions.loadersDirectory = tools_1.Tools.CompletePath(options.loaders);
            if (options.loadersSuffix) {
                this.connectorOptions.loadersOptions = { suffix: options.loadersSuffix };
            }
        }
        else if (options.loadersSuffix) {
            this.error = `Parameter '--loaders-suffix' should be used along with option '--loaders'.`;
        }
        //
        // Analyzing parameters for the Middlewares manager.
        if (options.middlewares) {
            this.connectorOptions.middlewaresDirectory = tools_1.Tools.CompletePath(options.middlewares);
            if (options.middlewaresSuffix) {
                this.connectorOptions.middlewaresOptions = { suffix: options.middlewaresSuffix };
            }
        }
        else if (options.middlewaresSuffix) {
            this.error = `Parameter '--middlewares-suffix' should be used along with option '--middlewares'.`;
        }
        //
        // Analyzing parameters for the Routes manager.
        if (options.routes) {
            this.connectorOptions.routesDirectory = tools_1.Tools.CompletePath(options.routes);
            if (options.routesSuffix) {
                this.connectorOptions.routesOptions = { suffix: options.routesSuffix };
            }
        }
        else if (options.routesSuffix) {
            this.error = `Parameter '--routes-suffix' should be used along with option '--routes'.`;
        }
        //
        // Analyzing parameters for the Tasks manager.
        if (options.tasks) {
            this.connectorOptions.tasksDirectory = tools_1.Tools.CompletePath(options.tasks);
            if (options.tasksSuffix) {
                this.connectorOptions.tasksOptions = { suffix: options.tasksSuffix };
            }
        }
        else if (options.tasksSuffix) {
            this.error = `Parameter '--tasks-suffix' should be used along with option '--tasks'.`;
        }
        //
        // Analyzing parameters for the Mockup Routes manager.
        if (options.mockRoutes) {
            this.connectorOptions.mockRoutesConfig = tools_1.Tools.CompletePath(options.mockRoutes);
        }
        //
        // Analyzing parameters for the Mock-up Endpoints manager.
        if (options.endpoint && options.endpointDirectory) {
            const uri = options.endpoint[0] === '/' ? options.endpoint : `/${options.endpoint}`;
            this.connectorOptions.endpoints = {
                uri,
                directory: tools_1.Tools.CompletePath(options.endpointDirectory),
                options: {
                    globalBehaviors: []
                }
            };
            if (options.endpointBehaviors) {
                options.endpointBehaviors.split(',')
                    .forEach((b) => {
                    this.connectorOptions.endpoints.options.globalBehaviors.push(tools_1.Tools.CompletePath(b));
                });
            }
            this.availableUrls.push(uri);
        }
        else if (options.endpoint) {
            this.error = `Parameter '--endpoint' should be used along with option '--endpoint-directory'.`;
        }
        else if (options.endpointDirectory) {
            this.error = `Parameter '--endpoint-directory' should be used along with option '--endpoint'.`;
        }
        else if (options.endpointBehaviors && !options.endpoint) {
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
    setAndLoadArguments() {
        this.program
            .version(tools_1.Tools.Instance().version(), '-v, --version')
            .option('-c, --configs [path]', 'directory where configuration files are stored.')
            .option('-e, --endpoint [uri]', 'URL where to provide an endpoint mock-up.')
            .option('-E, --endpoint-directory [path]', 'directory where endpoint mock-up files are stored.')
            .option('-l, --loaders [path]', 'directory where initialization files are stored.')
            .option('-m, --middlewares [path]', 'directory where middleware files are stored.')
            .option('-p, --port [port-number]', 'port number (default is 3005).')
            .option('-r, --routes [path]', 'directory where route files are stored.')
            .option('-R, --mock-routes [path]', 'configuration file for mock-up routes.')
            .option('-t, --tasks [path]', 'directory where task files are stored.')
            .option('--configs-suffix [suffix]', 'expected extension on configuration files.')
            .option('--endpoint-behaviors [path]', 'path to a behavior script for endpoint mock-up.')
            .option('--loaders-suffix [suffix]', 'expected extension on initialization files.')
            .option('--middlewares-suffix [suffix]', 'expected extension on middleware files.')
            .option('--no-ui', 'do not load internal WebUI.')
            .option('--routes-suffix [suffix]', 'expected extension on route files.')
            .option('--tasks-suffix [suffix]', 'expected extension on task files.')
            .option('--test-run', 'does almost everything except start the server and listen its port.');
        this.program.addHelpText('beforeAll', `DRTools Server (v${tools_1.Tools.Instance().version()}):`);
        this.program.parse(process.argv);
    }
    startServer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let configs = null;
            let loaders = null;
            let middlewares = null;
            let routes = null;
            let tasks = null;
            let mockRoutes = null;
            let endpoints = null;
            const exitHandler = (options, err) => {
                process.exit();
            };
            const listingInfo = () => {
                console.log(`\nListening at '${chalk_1.default.green(`http://localhost:${this.port}`)}'`);
                if (configs && this.connectorOptions.configsDirectory) {
                    const error = configs.valid() ? '' : chalk_1.default.yellow(` (Error: ${configs.lastError()})`);
                    const suffix = this.connectorOptions.configsOptions && this.connectorOptions.configsOptions.suffix ? ` (suffix: '.${this.connectorOptions.configsOptions.suffix}')` : '';
                    console.log(`\t- Configuration files at '${chalk_1.default.green(this.connectorOptions.configsDirectory)}'${suffix}${error}`);
                }
                if (loaders && this.connectorOptions.loadersDirectory) {
                    const error = loaders.valid() ? '' : chalk_1.default.yellow(` (Error: ${loaders.lastError()})`);
                    const suffix = this.connectorOptions.loadersOptions && this.connectorOptions.loadersOptions.suffix ? ` (suffix: '.${this.connectorOptions.loadersOptions.suffix}')` : '';
                    console.log(`\t- Initialization files at '${chalk_1.default.green(this.connectorOptions.loadersDirectory)}'${suffix}${error}`);
                }
                if (middlewares && this.connectorOptions.middlewaresDirectory) {
                    const error = middlewares.valid() ? '' : chalk_1.default.yellow(` (Error: ${middlewares.lastError()})`);
                    const suffix = this.connectorOptions.middlewaresOptions && this.connectorOptions.middlewaresOptions.suffix ? ` (suffix: '.${this.connectorOptions.middlewaresOptions.suffix}')` : '';
                    console.log(`\t- Middleware files at '${chalk_1.default.green(this.connectorOptions.middlewaresDirectory)}'${suffix}${error}`);
                }
                if (routes && this.connectorOptions.routesDirectory) {
                    const error = routes.valid() ? '' : chalk_1.default.yellow(` (Error: ${routes.lastError()})`);
                    const suffix = this.connectorOptions.routesOptions && this.connectorOptions.routesOptions.suffix ? ` (suffix: '.${this.connectorOptions.routesOptions.suffix}')` : '';
                    console.log(`\t- Route files at '${chalk_1.default.green(this.connectorOptions.routesDirectory)}'${suffix}${error}`);
                }
                if (tasks && this.connectorOptions.tasksDirectory) {
                    const error = tasks.valid() ? '' : chalk_1.default.yellow(` (Error: ${tasks.lastError()})`);
                    const suffix = this.connectorOptions.tasksOptions && this.connectorOptions.tasksOptions.suffix ? ` (suffix: '.${this.connectorOptions.tasksOptions.suffix}')` : '';
                    console.log(`\t- Task files at '${chalk_1.default.green(this.connectorOptions.tasksDirectory)}'${suffix}${error}`);
                }
                if (mockRoutes && mockRoutes) {
                    const error = mockRoutes.valid() ? '' : chalk_1.default.yellow(` (Error: ${mockRoutes.lastError()})`);
                    console.log(`\t- Mock-up routes configuration '${chalk_1.default.green(mockRoutes.configPath())}'${error}`);
                }
                if (endpoints && this.connectorOptions.endpoints) {
                    const error = endpoints.valid() ? '' : chalk_1.default.yellow(` (Error: ${endpoints.lastError()})`);
                    console.log(`\t- Mock-up Endpoint${error}`);
                    console.log(`\t\tURI:       '${chalk_1.default.green(endpoints.uri())}'`);
                    console.log(`\t\tDirectory: '${chalk_1.default.green(endpoints.directory())}'`);
                    const options = endpoints.options();
                    if (options && options.globalBehaviors && options.globalBehaviors.length > 0) {
                        console.log(`\t\tBehaviors:`);
                        options.globalBehaviors.forEach((b) => console.log(`\t\t\t'${chalk_1.default.green(b)}'`));
                    }
                }
                if (this.webUI) {
                    console.log(`WebUI at '${chalk_1.default.green(`http://localhost:${this.port}/.drtools`)}'`);
                }
                console.log();
            };
            try {
                const app = express_1.default();
                app.use(body_parser_1.default.json());
                app.use(body_parser_1.default.urlencoded({ extended: false }));
                app.use((req, res, next) => {
                    if (this.chalkForMethods[req.method] !== undefined) {
                        console.log(`${this.chalkForMethods[req.method](`[${req.method}]`)}: ${chalk_1.default.cyan(req.originalUrl)}`);
                    }
                    else {
                        console.log(`[${chalk_1.default.cyan(req.method)}]: ${chalk_1.default.cyan(req.originalUrl)}`);
                    }
                    next();
                });
                drtools_1.ExpressConnector.attach(app, { webUi: this.webUI });
                if (this.connectorOptions.configsDirectory) {
                    configs = new drtools_1.ConfigsManager(this.connectorOptions.configsDirectory, this.connectorOptions.configsOptions);
                }
                if (this.connectorOptions.loadersDirectory) {
                    loaders = new drtools_1.LoadersManager(this.connectorOptions.loadersDirectory, this.connectorOptions.loadersOptions, configs);
                    yield loaders.load();
                }
                if (this.connectorOptions.middlewaresDirectory) {
                    middlewares = new drtools_1.MiddlewaresManager(app, this.connectorOptions.middlewaresDirectory, this.connectorOptions.middlewaresOptions, configs);
                    yield middlewares.load();
                }
                if (configs && this.connectorOptions.routesDirectory) {
                    routes = new drtools_1.RoutesManager(app, this.connectorOptions.routesDirectory, this.connectorOptions.routesOptions, configs);
                    yield routes.load();
                }
                if (routes) {
                    for (const r of routes.itemNames()) {
                        this.availableUrls.push(`/${r}`);
                    }
                }
                if (configs && this.connectorOptions.tasksDirectory) {
                    tasks = new drtools_1.TasksManager(this.connectorOptions.tasksDirectory, this.connectorOptions.tasksOptions, configs);
                    yield tasks.load();
                }
                if (this.connectorOptions.mockRoutesConfig) {
                    mockRoutes = new drtools_1.MockRoutesManager(app, this.connectorOptions.mockRoutesConfig, {}, configs);
                }
                if (this.connectorOptions.endpoints) {
                    endpoints = new drtools_1.EndpointsManager({
                        directory: this.connectorOptions.endpoints.directory,
                        uri: this.connectorOptions.endpoints.uri,
                        options: this.connectorOptions.endpoints.options
                    }, configs);
                    app.use(endpoints.provide());
                }
                app.all('*', (req, res) => {
                    const result = {
                        message: `Path '${req.url}' was not found.`
                    };
                    if (req.originalUrl === '/') {
                        result.availableUrls = this.availableUrls.sort();
                    }
                    res.status(404).json(result);
                });
                if (this.program.opts().testRun) {
                    listingInfo();
                }
                else {
                    http.createServer(app).listen(this.port, listingInfo);
                }
            }
            catch (err) {
                console.error(chalk_1.default.red(`There was an error loading managers.`), err);
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
        });
    }
}
exports.DRToolsServer = DRToolsServer;
