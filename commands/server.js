#!/usr/bin/env node
'use strict';

const bodyParser = require('body-parser');
const chalk = require('chalk');
const commander = require('commander');
const express = require('express');
const fs = require('fs');
const glob = require('glob');
const http = require('http');
const path = require('path');
const tools = require('./tools');

const {
    ConfigsConstants,
    ExpressConnector
} = require('..');

//
// Default values @{
let availableUrls = [];
const chalkForMethods = {
    DELETE: chalk.red,
    GET: chalk.green,
    POST: chalk.red,
    PUT: chalk.yellow,
    PATCH: chalk.yellow
};
let error = null;
let connectorOptions = {
    verbose: true
};
let webUI = true;
let port = false;
// @}

console.log(`DRTools Server (v${tools.version()}):\n`);

const setAndLoadArguments = () => {
    commander
        .version(tools.version(), '-v, --version')
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
const parseArguments = () => {
    port = commander.port || 3005;

    if (commander.configs) {
        connectorOptions.configsDirectory = path.join(process.cwd(), commander.configs);
        availableUrls.push(ConfigsConstants.PublishUri);

        if (commander.configsSuffix) {
            connectorOptions.configsOptions = { suffix: commander.configsSuffix };
        }
    } else if (commander.configsSuffix) {
        error = `Parameter '--configs-suffix' should be used along with option '--configs'.`;
    }

    if (commander.loaders) {
        connectorOptions.loadersDirectory = path.join(process.cwd(), commander.loaders);

        if (commander.loadersSuffix) {
            connectorOptions.loadersOptions = { suffix: commander.loadersSuffix };
        }
    } else if (commander.loadersSuffix) {
        error = `Parameter '--loaders-suffix' should be used along with option '--loaders'.`;
    }

    if (commander.middlewares) {
        connectorOptions.middlewaresDirectory = path.join(process.cwd(), commander.middlewares);

        if (commander.middlewaresSuffix) {
            connectorOptions.middlewaresOptions = { suffix: commander.middlewaresSuffix };
        }
    } else if (commander.middlewaresSuffix) {
        error = `Parameter '--middlewares-suffix' should be used along with option '--middlewares'.`;
    }

    if (commander.routes) {
        connectorOptions.routesDirectory = path.join(process.cwd(), commander.routes);

        if (commander.routesSuffix) {
            connectorOptions.routesOptions = { suffix: commander.routesSuffix };
        }
    } else if (commander.routesSuffix) {
        error = `Parameter '--routes-suffix' should be used along with option '--routes'.`;
    }

    if (commander.tasks) {
        connectorOptions.tasksDirectory = path.join(process.cwd(), commander.tasks);

        if (commander.tasksSuffix) {
            connectorOptions.tasksOptions = { suffix: commander.tasksSuffix };
        }
    } else if (commander.tasksSuffix) {
        error = `Parameter '--tasks-suffix' should be used along with option '--tasks'.`;
    }

    if (commander.endpoint && commander.endpointDirectory) {
        const uri = commander.endpoint[0] === '/' ? commander.endpoint : `/${commander.endpoint}`;
        connectorOptions.endpoints = {
            uri,
            directory: path.join(process.cwd(), commander.endpointDirectory),
            options: {
                globalBehaviors: []
            }
        };

        if (commander.endpointBehaviors) {
            commander.endpointBehaviors.split(',')
                .forEach(b => {
                    connectorOptions.endpoints.options.globalBehaviors.push(path.join(process.cwd(), b));
                });
        }

        availableUrls.push(uri);
    } else if (commander.endpoint) {
        error = `Parameter '--endpoint' should be used along with option '--endpoint-directory'.`;
    } else if (commander.endpointDirectory) {
        error = `Parameter '--endpoint-directory' should be used along with option '--endpoint'.`;
    } else if (commander.endpointBehaviors && !commander.endpoint) {
        error = `Parameter '--endpoint-behaviors' should be used along with option '--endpoint'.`;
    }

    connectorOptions.webUi = webUI = commander.ui;
    // @}

    if (!error && Object.keys(connectorOptions).length === 2) {
        error = `There's nothing to serve.`;
    }
}
const startServer = () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use((req, res, next) => {
        if (typeof chalkForMethods[req.method] !== 'undefined') {
            console.log(`${chalkForMethods[req.method](`[${req.method}]`)}: ${chalk.cyan(req.originalUrl)}`);
        } else {
            console.log(`[${chalk.cyan(req.method)}]: ${chalk.cyan(req.originalUrl)}`);
        }
        next();
    });

    const connecterResults = ExpressConnector.attach(app, connectorOptions);
    const { configs, endpoints, loaders, middlewares, routes, tasks } = connecterResults;
    if (routes) {
        routes.itemNames().forEach(r => availableUrls.push(`/${r}`));
    }

    app.all('*', (req, res) => {
        const result = {
            message: `Path '${req.url}' was not found.`
        };

        if (req.originalUrl === '/') {
            result.availableUrls = availableUrls.sort();
        }

        res.status(404).json(result);
    });

    const listingInfo = () => {
        console.log(`\nListening at '${chalk.green(`http://localhost:${port}`)}'`);

        if (connectorOptions.configsDirectory) {
            const error = configs.valid() ? '' : chalk.yellow(` (Error: ${configs.lastError()})`);
            const suffix = connectorOptions.configsOptions && connectorOptions.configsOptions.suffix ? ` (suffix: '.${connectorOptions.configsOptions.suffix}')` : '';
            console.log(`\t- Configuration files at '${chalk.green(connectorOptions.configsDirectory)}'${suffix}${error}`);
        }

        if (connectorOptions.loadersDirectory) {
            const error = loaders.valid() ? '' : chalk.yellow(` (Error: ${loaders.lastError()})`);
            const suffix = connectorOptions.loadersOptions && connectorOptions.loadersOptions.suffix ? ` (suffix: '.${connectorOptions.loadersOptions.suffix}')` : '';
            console.log(`\t- Initialization files at '${chalk.green(connectorOptions.loadersDirectory)}'${suffix}${error}`);
        }

        if (connectorOptions.middlewaresDirectory) {
            const error = middlewares.valid() ? '' : chalk.yellow(` (Error: ${middlewares.lastError()})`);
            const suffix = connectorOptions.middlewaresOptions && connectorOptions.middlewaresOptions.suffix ? ` (suffix: '.${connectorOptions.middlewaresOptions.suffix}')` : '';
            console.log(`\t- Middleware files at '${chalk.green(connectorOptions.middlewaresDirectory)}'${suffix}${error}`);
        }

        if (connectorOptions.routesDirectory) {
            const error = routes.valid() ? '' : chalk.yellow(` (Error: ${routes.lastError()})`);
            const suffix = connectorOptions.routesOptions && connectorOptions.routesOptions.suffix ? ` (suffix: '.${connectorOptions.routesOptions.suffix}')` : '';
            console.log(`\t- Route files at '${chalk.green(connectorOptions.routesDirectory)}'${suffix}${error}`);
        }

        if (connectorOptions.tasksDirectory) {
            const error = tasks.valid() ? '' : chalk.yellow(` (Error: ${tasks.lastError()})`);
            const suffix = connectorOptions.tasksOptions && connectorOptions.tasksOptions.suffix ? ` (suffix: '.${connectorOptions.tasksOptions.suffix}')` : '';
            console.log(`\t- Task files at '${chalk.green(connectorOptions.tasksDirectory)}'${suffix}${error}`);
        }

        if (connectorOptions.endpoints) {
            endpoints.forEach(endpoint => {
                const error = endpoint.valid() ? '' : chalk.yellow(` (Error: ${endpoint.lastError()})`);

                console.log(`\t- Mock-up Endpoint${error}`);
                console.log(`\t\tURI:       '${chalk.green(endpoint.uri())}'`);
                console.log(`\t\tDirectory: '${chalk.green(endpoint.directory())}'`);
                const options = endpoint.options();
                if (options.globalBehaviors.length > 0) {
                    console.log(`\t\tBehaviors:`);
                    options.globalBehaviors.forEach(b => console.log(`\t\t\t'${chalk.green(b)}'`));
                }
            });
        }

        if (webUI) {
            console.log(`WebUI at '${chalk.green(`http://localhost:${port}/.drtools`)}'`);
        }

        console.log();
    };

    if (commander.testRun) {
        listingInfo();
    } else {
        http.createServer(app).listen(port, listingInfo);
    }

    const exitHandler = (options, err) => {
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

//
// Running @{
setAndLoadArguments();
parseArguments();
if (!error) {
    startServer();
} else {
    console.error(chalk.red(error));
}
// @}
