<!-- version-warning -->
!>__<span style="color:red">WARNING: THIS DOCUMENT IS OUT OF DATE SINCE VERSION
0.0.1</span>__
<!-- /version-warning -->

# DRTools: Middlewares

## What is a middleware?
Well this is easy to explain, just visit [this
link](http://expressjs.com/en/guide/using-middleware.html) on ExpressJS
documentation.

## How to invoke it
Considering that you have a directory where you store all your scripts files
that export a middleware function, you can do something like this:
```js
const express = require('express');
const { MiddlewaresManager } = require('drtools');

const app = express();

// some other settings.

const manager = new MiddlewaresManager(app, 'directory/with/middleware/files');
```

### How does it look
If you wonder how a _middleware_ you can use looks like, this is a simple example:
```js
'use strict';

module.exports = (req, res, next) => {
    console.log(`Request: ${req.originalUrl}`);
    next();
};
```

## Options
When you create a new manager you may pass these options in an object as a third
argument:

| Option    |    Type   |    Default   | Description                                                 |
|-----------|:---------:|:------------:|-------------------------------------------------------------|
| `suffix`  |  `string` | `middleware` | Suffix to be expected on each middleware file to be loaded. |
| `verbose` | `boolean` |    `true`    | Whether to display loading log information or not.          |

## Koa.js
Yes there's support for [koa.js](https://koajs.com/) middlewares.

<!-- version-check:0.0.1 -->
