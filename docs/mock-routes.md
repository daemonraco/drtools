# DRTools: Mock-up Routes
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What are mock-up routes?](#what-are-mock-up-routes)
- [How to invoke it](#how-to-invoke-it)
    - [Configuration file](#configuration-file)
    - [By method](#by-method)
- [Guards](#guards)
- [Options](#options)

<!-- /TOC -->

## What are mock-up routes?
_Mock-up routes_ is a way to arbitrarily return certain file on a specific URI and
method.

## How to invoke it
Consider that you have a directory where you store a configuration file and some
basic files you want to expose as URI responses.
Let's assume that directory is `/path/to/stuff` and has this assets:
* `config.json`
* `simple-html.html`
* `simple-image.png`
* `simple-json.json`
* `simple-text.txt`

Where `config.json` is the configuration file.

With this you can load these routes in this way:
```js
const express = require('express');
const { MockRoutesManager } = require('drtools');

const app = express();

// some other settings.

const manager = new MockRoutesManager(app, '/path/to/stuff/config.json');
```

### Configuration file
_How does the configuration looks like?_

Something like this:
```json
{
    "routes": [
        {
            "uri": "/simple-text",
            "path": "./simple-text.txt"
        },
        {
            "uri": "/simple-html",
            "path": "./simple-html.html"
        },
        {
            "uri": "/simple-json",
            "path": "./simple-json.json"
        },
        {
            "uri": "/simple-image",
            "path": "./simple-image.png"
        }
    ]
}
```
_Note:_ All this URIs will respond specified files on any request mehtod.

### By method
If you want to respond all your files on any method, but `./simple-json.json` only
on `POST` method, you can a configuration like this one:
```json
{
    "routes": {
        "*": [
            {
                "uri": "/simple-text",
                "path": "./simple-text.txt"
            },
            {
                "uri": "/simple-html",
                "path": "./simple-html.html"
            },
            {
                "uri": "/simple-image",
                "path": "./simple-image.png"
            }
        ],
        "post": [
            {
                "uri": "/simple-json",
                "path": "./simple-json.json"
            }
        ]
    }
}
```

## Guards
If a route requires some sort of prevalidation before it's returned, for example
logged-in user privileges, you can create a simple validation module and then
specify it on those routes that require it.

Let's say we continue our examples and reconsider the folder `/path/to/stuff`.
Let's also say we want to force a user to use the query parameter `guard` when
requesting `/simple-json`.

To achieve this we need to create a guard first.
Firse we add file called `my-guard.js` inside `/path/to/stuff` with these
contents:
```js
'use strict';

module.exports = (req, res, next) => {
    if (typeof req.query.guard !== 'undefined') {
        next();
    } else {
        res.status(403).json({
            message: `You are not allowed on this route.`
        });
    }
};
```

Then, we need to change our configuration:
```json
{
    "routes": [
        {
            "uri": "/simple-json",
            "path": "./simple-json.json",
            "guard": "./my-guard.js"
        }
    ]
}
```

## Options
When you create a new manager you may pass these options in an object as a third
argument:

| Option    |    Type   |    Default   | Description                                                 |
|-----------|:---------:|:------------:|-------------------------------------------------------------|
| `verbose` | `boolean` |    `true`    | Whether to display loading log information or not.          |

----
[Back to README](../README.md)
