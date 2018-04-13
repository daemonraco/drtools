#!/usr/bin/env node
'use strict';

const bodyParser = require('body-parser');
const chalk = require('chalk');
const commander = require('commander');
const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const tools = require('./tools');

const {
    ConfigsConstants,
    ExpressConnector
} = require('..');

let error = null;

commander
    .version(tools.version(), '-v, --version')
    .option('-c, --configs [path]', 'Directory where configuration files are stored.')
    .option('-e, --endpoint [uri]', 'URL where to provide an endpoint mock-up.')
    .option('-E, --endpoint-directory [path]', 'Directory where endpoint mock-up files are stored.')
    .option('-l, --loaders [path]', 'Directory where initialization files are stored.')
    .option('-m, --middlewares [path]', 'Directory where middleware files are stored.')
    .option('-p, --port [port-number]', 'Port number (default is 3005).')
    .option('-r, --routes [path]', 'Directory where route files are stored.')
    .option('--endpoint-behaviors [path]', 'Path to a behavior script for endpoint mock-up.')
    .parse(process.argv);

console.log(`DRTools Server (v${tools.version()}):\n`);

const port = commander.port || 3005;

const availableUrls = [];
const connectorOptions = {
    verbose: true
};

if (commander.configs) {
    connectorOptions.configsDirectory = path.join(process.cwd(), commander.configs);
    availableUrls.push(ConfigsConstants.PublishUri);
}
if (commander.loaders) {
    connectorOptions.loadersDirectory = path.join(process.cwd(), commander.loaders);
}
if (commander.middlewares) {
    connectorOptions.middlewaresDirectory = path.join(process.cwd(), commander.middlewares);
}
if (commander.routes) {
    connectorOptions.routesDirectory = path.join(process.cwd(), commander.routes);
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
    error = `Parameter '--endpoint' should be used along with option'--endpoint-directory'.`;
} else if (commander.endpointDirectory) {
    error = `Parameter '--endpoint-directory' should be used along with option'--endpoint'.`;
} else if (commander.endpointBehaviors && !commander.endpoint) {
    error = `Parameter '--endpoint-behaviors' should be used along with option'--endpoint'.`;
}

if (Object.keys(connectorOptions).length === 1) {
    error = `There's nothing to serve.`;
}

const chalkForMethods = {
    DELETE: chalk.red,
    GET: chalk.green,
    POST: chalk.red,
    PUT: chalk.yellow,
    PATCH: chalk.yellow
};

if (!error) {
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

    const {
        configs,
        loaders,
        middlewares,
        routes,
        endpoints
    } = ExpressConnector.attach(app, connectorOptions);
    if (routes) {
        routes.routes().forEach(r => availableUrls.push(`/${r}`));
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

    http.createServer(app).listen(port, () => {
        console.log(`\nListening at '${chalk.green(`http://localhost:${port}`)}'`);

        if (connectorOptions.configsDirectory) {
            console.log(`\t- Configuration files at '${chalk.green(connectorOptions.configsDirectory)}'`);
        }
        if (connectorOptions.loadersDirectory) {
            console.log(`\t- Initialization files at '${chalk.green(connectorOptions.loadersDirectory)}'`);
        }
        if (connectorOptions.middlewaresDirectory) {
            console.log(`\t- Middleware files at '${chalk.green(connectorOptions.middlewaresDirectory)}'`);
        }
        if (connectorOptions.routesDirectory) {
            console.log(`\t- Route files at '${chalk.green(connectorOptions.routesDirectory)}'`);
        }
        if (connectorOptions.endpoints) {
            connectorOptions.endpoints.forEach(endpoint => {
                console.log(`\t- Mock-up Endpoint`);
                console.log(`\t\tURI:       '${chalk.green(endpoint.uri)}'`);
                console.log(`\t\tDirectory: '${chalk.green(endpoint.directory)}'`);
                if (endpoint.options.globalBehaviors.length > 0) {
                    console.log(`\t\tBehaviors:`);
                    endpoint.options.globalBehaviors.forEach(b => console.log(`\t\t\t'${chalk.green(b)}'`));
                }
            });
        }
    });

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
} else {
    console.error(chalk.red(error));
}
