# DRTools: ExpressJS Tools
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What does it do?](#what-does-it-do)
- [How to invoke it](#how-to-invoke-it)
- [Connector returned values](#connector-returned-values)
- [Options](#options)

<!-- /TOC -->

## What does it do?
It provides a set of tools that can be automatically attached to a express server.

## How to invoke it
Let's say you have these directories:
* `/path/to/configs`: A directory where configuration files are stored, either
JavaScript or JSON files (visit [this](configs.md) for more information).
* `/path/to/loaders`: A directory where loader scripts are stored (visit
[this](loaders.md) for more information).
* `/path/to/api-endpoints`: A directory where you store a set of json files and
directories that act as a certain API mock-up (visit [this](endpoints.md) for
more information).
    * Let's assume here that you want to provide this mock-up on the URI
    `/api/v1.0`.
* `/path/to/middlewares`: A directory where you store middleware that have to be
attached to a ExpressJS server (visit [this](middlewares.md) for more
information).
* `/path/to/routes`: A directory where you store routes that have to be attached
to a ExpressJS server (visit [this](routes.md) for more information).

Then you can invoke the connector in this way:
```js
const express = require('express');
const path = require('path');
const app = express();

const { ExpressConnector } = require('drtools');
ExpressConnector.attach(app, {
    configsDirectory: `/path/to/configs`,
    loadersDirectory: `/path/to/loaders`,
    endpoints: {
        directory: `/path/to/api-endpoints`,
        uri: `/api/v1.0`
    },
    middlewaresDirectory: `/path/to/middlewares`,
    routesDirectory: `/path/to/routes`
});
// @}
```
This will run an load all managers at once.

## Connector returned values
When the connector finishes attaching all its assets to ExpressJS, it returns an
object with these entries:
* `configs`: Configurations manager used.
* `endpoints`: List of endpoints managers used.
* `loaders`: Loaders manager used.
* `middlewares`: Middlewares manager used.
* `routes`: Routes manager used.

## Options
When you invoke `ExpressConnector.attach()` you may pass these options:

| Option                 | Type                                                   | Default | Description                                                                                                                                                        |
|------------------------|--------------------------------------------------------|:-------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `configsDirectory`     | `string`                                               |  `null` | Directory where configuration files are stored.                                                                                                                    |
| `configsOptions`       | `ConfigOptions`                                        |   `{}`  | Set of options to be used whe the configuration manager is started.                                                                                                |
| `publishConfigs`       | `boolean`, `string`                                    |  `true` | Whether to provide the route `/public-configs` with public parts of your configuration files. If you give a `string` instead of a `boolean` it will use it as URI. |
| `loadersDirectory`     | `string`                                               |  `null` | Directory where loader scripts are stored.                                                                                                                         |
| `loadersOptions`       | `LoaderOptions`                                        |   `{}`  | Set of options to be used when a loaders manager is started.                                                                                                       |
| `middlewaresDirectory` | `string`                                               |  `null` | Directory where middleware scripts are stored.                                                                                                                     |
| `middlewaresOptions`   | `MiddlewareOptions`                                    |   `{}`  | Set of options to be used when the middleware manager is started.                                                                                                  |
| `routesDirectory`      | `string`                                               |  `null` | Directory where express routes loaders are stored.                                                                                                                 |
| `routesOptions`        | `RouteOptions`                                         |   `{}`  | Set of options to be used when the routes manager is started.                                                                                                      |
| `endpoints`            | `EndpointsManagerOptions`, `EndpointsManagerOptions[]` |   `[]`  | Mock-up endpoints configuration                                                                                                                                    |
| `verbose`              | `boolean`                                              |  `true` | Whether to display loading log information or not.                                                                                                                 |

----
[Back to README](../README.md)
