__<span style="color:red">WARNING: THIS DOCUMENT IS REALLY OUT OF DATE SINCE
VERSION 0.5.0</span>__

# DRTools: Middlewares
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is a middleware?](#what-is-a-middleware)
- [How to invoke it](#how-to-invoke-it)
    - [How does it look](#how-does-it-look)
- [Options](#options)

<!-- /TOC -->

## What is a middleware?
Well this is easy to explain, just visit [this
link](http://expressjs.com/en/guide/using-middleware.html) on ExpressJS documentation.

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

----
[Back to README](../README.md)
