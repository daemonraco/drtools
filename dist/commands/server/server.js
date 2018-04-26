"use strict";
/**
 * @file server.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drtools_1 = require("../../core/drtools");
const tools_1 = require("../includes/tools");
class DRToolsServer {
    constructor() {
        //
        // Protected methods.
        this.availableUrls = [];
        this.chalkForMethods = {
            DELETE: libraries_1.chalk.red,
            GET: libraries_1.chalk.green,
            POST: libraries_1.chalk.red,
            PUT: libraries_1.chalk.yellow,
            PATCH: libraries_1.chalk.yellow
        };
        this.connectorOptions = {
            verbose: true
        };
        this.error = null;
        this.port = false;
        this.webUI = true;
    }
    //
    // Public methods.
    run() {
        console.log(`DRTools Server (v${tools_1.Tools.Instance().version()}):\n`);
        this.setAndLoadArguments();
        this.parseArguments();
        if (!this.error) {
            this.startServer();
        }
        else {
            console.error(libraries_1.chalk.red(this.error));
        }
    }
    //
    // Protected methods.
    parseArguments() {
        this.port = libraries_1.commander.port || 3005;
        if (libraries_1.commander.configs) {
            this.connectorOptions.configsDirectory = tools_1.Tools.CompletePath(libraries_1.commander.configs);
            this.availableUrls.push(drtools_1.ConfigsConstants.PublishUri);
            if (libraries_1.commander.configsSuffix) {
                this.connectorOptions.configsOptions = { suffix: libraries_1.commander.configsSuffix };
            }
        }
        else if (libraries_1.commander.configsSuffix) {
            this.error = `Parameter '--configs-suffix' should be used along with option '--configs'.`;
        }
        if (libraries_1.commander.loaders) {
            this.connectorOptions.loadersDirectory = tools_1.Tools.CompletePath(libraries_1.commander.loaders);
            if (libraries_1.commander.loadersSuffix) {
                this.connectorOptions.loadersOptions = { suffix: libraries_1.commander.loadersSuffix };
            }
        }
        else if (libraries_1.commander.loadersSuffix) {
            this.error = `Parameter '--loaders-suffix' should be used along with option '--loaders'.`;
        }
        if (libraries_1.commander.middlewares) {
            this.connectorOptions.middlewaresDirectory = tools_1.Tools.CompletePath(libraries_1.commander.middlewares);
            if (libraries_1.commander.middlewaresSuffix) {
                this.connectorOptions.middlewaresOptions = { suffix: libraries_1.commander.middlewaresSuffix };
            }
        }
        else if (libraries_1.commander.middlewaresSuffix) {
            this.error = `Parameter '--middlewares-suffix' should be used along with option '--middlewares'.`;
        }
        if (libraries_1.commander.routes) {
            this.connectorOptions.routesDirectory = tools_1.Tools.CompletePath(libraries_1.commander.routes);
            if (libraries_1.commander.routesSuffix) {
                this.connectorOptions.routesOptions = { suffix: libraries_1.commander.routesSuffix };
            }
        }
        else if (libraries_1.commander.routesSuffix) {
            this.error = `Parameter '--routes-suffix' should be used along with option '--routes'.`;
        }
        if (libraries_1.commander.tasks) {
            this.connectorOptions.tasksDirectory = tools_1.Tools.CompletePath(libraries_1.commander.tasks);
            if (libraries_1.commander.tasksSuffix) {
                this.connectorOptions.tasksOptions = { suffix: libraries_1.commander.tasksSuffix };
            }
        }
        else if (libraries_1.commander.tasksSuffix) {
            this.error = `Parameter '--tasks-suffix' should be used along with option '--tasks'.`;
        }
        if (libraries_1.commander.mockRoutes) {
            this.connectorOptions.mockRoutesConfig = tools_1.Tools.CompletePath(libraries_1.commander.mockRoutes);
        }
        if (libraries_1.commander.endpoint && libraries_1.commander.endpointDirectory) {
            const uri = libraries_1.commander.endpoint[0] === '/' ? libraries_1.commander.endpoint : `/${libraries_1.commander.endpoint}`;
            this.connectorOptions.endpoints = {
                uri,
                directory: tools_1.Tools.CompletePath(libraries_1.commander.endpointDirectory),
                options: {
                    globalBehaviors: []
                }
            };
            if (libraries_1.commander.endpointBehaviors) {
                libraries_1.commander.endpointBehaviors.split(',')
                    .forEach((b) => {
                    this.connectorOptions.endpoints.options.globalBehaviors.push(tools_1.Tools.CompletePath(b));
                });
            }
            this.availableUrls.push(uri);
        }
        else if (libraries_1.commander.endpoint) {
            this.error = `Parameter '--endpoint' should be used along with option '--endpoint-directory'.`;
        }
        else if (libraries_1.commander.endpointDirectory) {
            this.error = `Parameter '--endpoint-directory' should be used along with option '--endpoint'.`;
        }
        else if (libraries_1.commander.endpointBehaviors && !libraries_1.commander.endpoint) {
            this.error = `Parameter '--endpoint-behaviors' should be used along with option '--endpoint'.`;
        }
        this.connectorOptions.webUi = this.webUI = libraries_1.commander.ui;
        if (this.webUI) {
            this.availableUrls.push('/.drtools');
        }
        // @}
        if (!this.error && Object.keys(this.connectorOptions).length === 2) {
            this.error = `There's nothing to serve.`;
        }
    }
    setAndLoadArguments() {
        libraries_1.commander
            .version(tools_1.Tools.Instance().version(), '-v, --version')
            .option('-c, --configs [path]', 'directory where configuration files are stored.')
            .option('-e, --endpoint [uri]', 'URL where to provide an endpoint mock-up.')
            .option('-E, --endpoint-directory [path]', 'directory where endpoint mock-up files are stored.')
            .option('-l, --loaders [path]', 'directory where initialization files are stored.')
            .option('-m, --middlewares [path]', 'directory where middleware files are stored.')
            .option('-p, --port [port-number]', 'port number (default is 3005).')
            .option('-r, --routes [path]', 'directory where route files are stored.')
            .option('-R, --mock-routes [path]', 'Configuration file for mock-up routes.')
            .option('-t, --tasks [path]', 'directory where task files are stored.')
            .option('--configs-suffix [suffix]', 'expected extension on configuration files.')
            .option('--endpoint-behaviors [path]', 'path to a behavior script for endpoint mock-up.')
            .option('--loaders-suffix [suffix]', 'expected extension on initialization files.')
            .option('--middlewares-suffix [suffix]', 'expected extension on middleware files.')
            .option('--no-ui', 'do not load internal WebUI.')
            .option('--routes-suffix [suffix]', 'expected extension on route files.')
            .option('--tasks-suffix [suffix]', 'expected extension on task files.')
            .option('--test-run', 'does almost everything except start the server and listen its port.')
            .parse(process.argv);
    }
    startServer() {
        const app = libraries_1.express();
        app.use(libraries_1.bodyParser.json());
        app.use(libraries_1.bodyParser.urlencoded({ extended: false }));
        app.use((req, res, next) => {
            if (typeof this.chalkForMethods[req.method] !== 'undefined') {
                console.log(`${this.chalkForMethods[req.method](`[${req.method}]`)}: ${libraries_1.chalk.cyan(req.originalUrl)}`);
            }
            else {
                console.log(`[${libraries_1.chalk.cyan(req.method)}]: ${libraries_1.chalk.cyan(req.originalUrl)}`);
            }
            next();
        });
        const connecterResults = drtools_1.ExpressConnector.attach(app, this.connectorOptions);
        const { configs, endpoints, loaders, middlewares, mockRoutes, routes, tasks } = connecterResults;
        if (routes) {
            routes.itemNames().forEach((r) => this.availableUrls.push(`/${r}`));
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
        const listingInfo = () => {
            console.log(`\nListening at '${libraries_1.chalk.green(`http://localhost:${this.port}`)}'`);
            if (this.connectorOptions.configsDirectory) {
                const error = configs.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${configs.lastError()})`);
                const suffix = this.connectorOptions.configsOptions && this.connectorOptions.configsOptions.suffix ? ` (suffix: '.${this.connectorOptions.configsOptions.suffix}')` : '';
                console.log(`\t- Configuration files at '${libraries_1.chalk.green(this.connectorOptions.configsDirectory)}'${suffix}${error}`);
            }
            if (this.connectorOptions.loadersDirectory) {
                const error = loaders.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${loaders.lastError()})`);
                const suffix = this.connectorOptions.loadersOptions && this.connectorOptions.loadersOptions.suffix ? ` (suffix: '.${this.connectorOptions.loadersOptions.suffix}')` : '';
                console.log(`\t- Initialization files at '${libraries_1.chalk.green(this.connectorOptions.loadersDirectory)}'${suffix}${error}`);
            }
            if (this.connectorOptions.middlewaresDirectory) {
                const error = middlewares.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${middlewares.lastError()})`);
                const suffix = this.connectorOptions.middlewaresOptions && this.connectorOptions.middlewaresOptions.suffix ? ` (suffix: '.${this.connectorOptions.middlewaresOptions.suffix}')` : '';
                console.log(`\t- Middleware files at '${libraries_1.chalk.green(this.connectorOptions.middlewaresDirectory)}'${suffix}${error}`);
            }
            if (this.connectorOptions.routesDirectory) {
                const error = routes.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${routes.lastError()})`);
                const suffix = this.connectorOptions.routesOptions && this.connectorOptions.routesOptions.suffix ? ` (suffix: '.${this.connectorOptions.routesOptions.suffix}')` : '';
                console.log(`\t- Route files at '${libraries_1.chalk.green(this.connectorOptions.routesDirectory)}'${suffix}${error}`);
            }
            if (this.connectorOptions.tasksDirectory) {
                const error = tasks.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${tasks.lastError()})`);
                const suffix = this.connectorOptions.tasksOptions && this.connectorOptions.tasksOptions.suffix ? ` (suffix: '.${this.connectorOptions.tasksOptions.suffix}')` : '';
                console.log(`\t- Task files at '${libraries_1.chalk.green(this.connectorOptions.tasksDirectory)}'${suffix}${error}`);
            }
            if (mockRoutes) {
                const error = mockRoutes.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${mockRoutes.lastError()})`);
                console.log(`\t- Mock-up routes configuration '${libraries_1.chalk.green(mockRoutes.configPath())}'${error}`);
            }
            if (this.connectorOptions.endpoints) {
                endpoints.forEach(endpoint => {
                    const error = endpoint.valid() ? '' : libraries_1.chalk.yellow(` (Error: ${endpoint.lastError()})`);
                    console.log(`\t- Mock-up Endpoint${error}`);
                    console.log(`\t\tURI:       '${libraries_1.chalk.green(endpoint.uri())}'`);
                    console.log(`\t\tDirectory: '${libraries_1.chalk.green(endpoint.directory())}'`);
                    const options = endpoint.options();
                    if (options.globalBehaviors.length > 0) {
                        console.log(`\t\tBehaviors:`);
                        options.globalBehaviors.forEach((b) => console.log(`\t\t\t'${libraries_1.chalk.green(b)}'`));
                    }
                });
            }
            if (this.webUI) {
                console.log(`WebUI at '${libraries_1.chalk.green(`http://localhost:${this.port}/.drtools`)}'`);
            }
            console.log();
        };
        if (libraries_1.commander.testRun) {
            listingInfo();
        }
        else {
            libraries_1.http.createServer(app).listen(this.port, listingInfo);
        }
        const exitHandler = (options, err) => {
            process.exit();
        };
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
exports.DRToolsServer = DRToolsServer;
