# DRTools: Configs
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [How to invoke it](#how-to-invoke-it)
- [Retriving one](#retriving-one)
- [JS instead of JSON](#js-instead-of-json)
- [Environments](#environments)
    - [Environment variables](#environment-variables)
- [Options](#options)

<!-- /TOC -->

## How to invoke it
Considering that you have a directory where you store all your configuration files
you can do something like this:
```js
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
```

## Retriving one
Let's say you have a configuration file named `myconf.config.json` looking like
this in your configurations directory:
```json
{
    "min": {
        "height": 768,
        "width": 1024
    }
}
```

Then, you can do something like this:
```js
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
const myconf = manager.get('myconf');
console.log(`Minimum height: ${myconf.min.height}`); // --> Minimum height: 768
```
Yes, the suffix `.config` is important.

## JS instead of JSON
If you instead have a file called `myconf.config.js` looking like this:
```js
'use strict';

const min = {
    height: 768,
    width: 1024
};

module.exports = {
    min,
    minGeometry: () => {
        return `${min.width}x${min.height}`;
    }
};
```

You can do the same:
```js
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
const myconf = manager.get('myconf');
console.log(`Minimum height: ${myconf.min.height}`); // --> Minimum height: 768
// and even
console.log(`Minimum geometry: ${myconf.minGeometry()}`); // --> Minimum geometry: 1024x768
```

## Environments
Now let's say your file `myconf.config.json` has the right values for minimum
height, except when it's in production in which case it should be `720`.
In this case you can create a file called `myconf.config.prod.json`, also in the same directory with this inside:
```json
{
    "min": {
        "height": 720
    }
}
```

Then you set the environment variable `ENV_NAME` to `prod`, something like this:
```sh
export ENV_NAME="prod";
```

Then, you can do something like this:
```js
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
const myconf = manager.get('myconf');
console.log(`Minimum width: ${myconf.min.width}`); // --> Minimum width: 1024
console.log(`Minimum height: ${myconf.min.height}`); // --> Minimum height: 720
```

As you can see, this loads the file `myconf.config.json` and then
`myconf.config.prod.json`, and merges them in that order.

### Environment variables
You may change the environment to load using:
* the environment variable `ENV_NAME` (used from `process.env.ENV_NAME`).
* the environment variable `NODE_ENV` (used from `process.env.NODE_ENV`).
* the global value `ENV_NAME` (used from `global.ENV_NAME`).
* the global value `NODE_ENV` (used from `global.NODE_ENV`).

If none of these is used, then the value is assume to be `default`.

## Options
When you create a new manager you may pass these options:
| Option    |    Type   |  Default | Description                                                    |
|-----------|:---------:|:--------:|----------------------------------------------------------------|
| `suffix`  |  `string` | `config` | Suffix to be expected on each configuration file to be loaded. |
| `verbose` | `boolean` |  `true`  | Whether to display loading log information or not.             |

----
[Back to README](../README.md)
