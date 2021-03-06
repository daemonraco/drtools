'use strict';

const port = parseInt(process.env.PORT || '3005', 10);

const bodyParser = require('body-parser');
const chalk = require('chalk');
const express = require('express');
const http = require('http');
const path = require('path');
//
// Importing DRTools.
const {
    ConfigsManager,
    EndpointsManager,
    ExpressConnector,
    LoadersManager,
    MiddlewaresManager,
    MockRoutesManager,
    RoutesManager,
    PluginsManager,
    TasksManager,
} = require('../..');
//
// Creating an express application.
const app = express();
//
// Loading steps.
const loadingSteps = [];
//
// Loading parser.
loadingSteps.push(async () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
});
//
// Section to be tested @{
loadingSteps.push(async () => {
    const configs = new ConfigsManager([
        path.join(__dirname, '../tmp/configs'),
        path.join(__dirname, '../tmp/secondary-configs'),
    ], {
        publishConfigs: true,
        key: 'main-configs',
        specs: path.join(__dirname, '../tmp/specs'),
        environmentVariables: true,
    });

    ExpressConnector.attach(app, { webUi: true });

    const loaders = new LoadersManager(path.join(__dirname, '../tmp/loaders'), {}, configs);
    await loaders.load();

    const middlewares = new MiddlewaresManager(app, path.join(__dirname, '../tmp/middlewares'), {}, configs);
    await middlewares.load();

    new MockRoutesManager(app, path.join(__dirname, '../tmp/mock-routes/mockup-routes.json'), {}, configs);

    const plugins = new PluginsManager(path.join(__dirname, '../tmp/plugins'), {}, configs);
    await plugins.load();

    const routes = new RoutesManager(app, path.join(__dirname, '../tmp/routes'), {}, configs);
    await routes.load();

    const tasks = new TasksManager(path.join(__dirname, '../tmp/tasks'), {}, configs);
    await tasks.load();

    const endpoints = new EndpointsManager({
        directory: path.join(__dirname, '../tmp/endpoints'),
        uri: 'api/v1.0',
        options: {
            globalBehaviors: path.join(__dirname, '../tmp/endpoints/.globals.js')
        }
    }, configs);
    app.use(endpoints.provide());
});
// @}
//
// Defaults.
loadingSteps.push(async () => {
    app.all('*', (req, res) => {
        res.status(404).json({
            message: `Path '${req.url}' was not found.`
        });
    });
});
//
// Starting.
(async () => {
    for (const step of loadingSteps) {
        try {
            await step();
        } catch (err) {
            console.error(chalk.red(err));
        }
    }
    //
    // Starting server.
    http.createServer(app).listen(port, () => {
        console.log(`listening on port ${port}`);
    });
})();
