<!-- version-warning -->
!>__<span style="color:red">WARNING: THIS DOCUMENT IS OUT OF DATE SINCE VERSION
0.0.1</span>__
<!-- /version-warning -->

# DRTools: Mock-up Routes

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
_Note:_ All this URIs will respond specified files on any request method.

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
If a route requires some sort of pre-validation before it's returned, for example
logged-in user privileges, you can create a simple validation module and then
specify it on those routes that require it.

Let's say we continue our examples and reconsider the folder `/path/to/stuff`.
Let's also say we want to force a user to use the query parameter `guard` when
requesting `/simple-json`.

To achieve this we need to create a guard first.
First we add file called `my-guard.js` inside `/path/to/stuff` with these
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

## General guards
The previous way requires you to specify a guard path on each route, but that's
not the only way, you can write something like this in your configuration:
```json
{
    "guards": [
        {
            "name": "basic-guard",
            "path": "./my-guard.js"
        }
    ],
    "routes": [
        {
            "uri": "/simple-json",
            "path": "./simple-json.json",
            "guardName": "basic-guard"
        }
    ]
}
```

This come in handy when you have many routes using the same path, if you happen to
need a change in such path, you just change it in one place.

## Default guard
Maybe you already guest it, all routes have a default guard that checks nothing
but it's there.
If you want to apply a your guard to all routes you can do this:
```json
{
    "guards": [
        {
            "name": "default",
            "path": "./my-guard.js"
        }
    ],
    "routes": [
        {
            "uri": "/simple-json",
            "path": "./simple-json.json"
        }
    ]
}
```

## Options
When you create a new manager you may pass these options in an object as a third
argument:

| Option    |    Type   | Default | Description                                        |
|-----------|:---------:|:-------:|----------------------------------------------------|
| `verbose` | `boolean` |  `true` | Whether to display loading log information or not. |

<!-- version-check:0.0.1 -->
