'use strict';

const port = parseInt(process.env.PORT || '3005', 10);

const chalk = require('chalk');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const path = require('path');
//
// Importing DRTools.
const {
    ConfigsManager,
    EndpointsManager,
    KoaConnector,
    LoadersManager,
    MiddlewaresManager,
    MockRoutesManager,
    PluginsManager,
    RoutesManager,
    TasksManager,
} = require('../..');
//
// Creating a KoaJS application.
const app = new Koa();
//
// Loading steps.
const loadingSteps = [];
//
// Loading parser.
loadingSteps.push(async () => {
    app.use(koaBody());
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

    KoaConnector.attach(app, { webUi: true });

    const loaders = new LoadersManager(path.join(__dirname, '../tmp/loaders'), {}, configs);
    await loaders.load();

    const middlewares = new MiddlewaresManager(app, path.join(__dirname, '../tmp/middlewares'), {
        suffix: 'middleware.koa',
    }, configs);
    await middlewares.load();

    new MockRoutesManager(app, path.join(__dirname, '../tmp/mock-routes/mockup-routes.json'), {}, configs);

    const plugins = new PluginsManager(path.join(__dirname, '../tmp/plugins'), {}, configs);
    await plugins.load();

    const routes = new RoutesManager(app, path.join(__dirname, '../tmp/routes'), {
        suffix: 'route.koa',
    }, configs);
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
    app.use(endpoints.provideForKoa());
});
// @}
//
// Defaults.
loadingSteps.push(async () => {
    app.use(async ctx => {
        ctx.status = 404
        ctx.body = {
            message: `Path '${ctx.url}' was not found.`
        };
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
    const server = http.createServer(app.callback());
    server.listen(port, async () => {
        console.log(`listening on port ${port}`);
    });
})();
