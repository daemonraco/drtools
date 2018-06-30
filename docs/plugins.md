# DRTools: Plugins
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is a plugin?](#what-is-a-plugin)
- [How to invoke it](#how-to-invoke-it)
- [Simple plugin](#simple-plugin)
- [Simpler plugin](#simpler-plugin)
- [With config](#with-config)
- [Options](#options)

<!-- /TOC -->

## What is a plugin?
A plugin is a collection of logics, in the case of _DRTools_ it's a directories
with a file called `index.js` that export functions.

## How to invoke it
Considering that you have a directory where you store all your plugin directories,
you can do something like this:
```js
const { PluginsManager } = require('drtools');
const manager = new PluginsManager('directory/with/plugins');
```

If you have a directory where you store your configurations you can also do this:
```js
const { ConfigsManager, PluginsManager } = require('drtools');
const configs = new ConfigsManager('directory/with/config/files');
const manager = new PluginsManager('directory/with/plugins', {}, configs);
```

## Simple plugin
Let's suppose that inside your plugins directory you have another directory called
`example` and inside it a file called `index.js` with this content:
```js
'use strict';

module.exports = {
    now: () => new Date()
};
```

Then you can invoke it with something like this:
```js
const func = manager.get('example::now');
console.log(`Current date: ${func()}`);
```

## Simpler plugin
Let's suppose that your plugins is even simple and exports only one function:
```js
'use strict';

module.exports = () => new Date();
```

Then you can invoke it with something like this:
```js
const func = manager.get('example::default');
console.log(`Current date: ${func()}`);
```

Or like like this:
```js
const func = manager.get('example');
console.log(`Current date: ${func()}`);
```

## With config
Let's say you have a configuration file called `plugin.example.config.json` with
these contents:
```json
{
    "level": 9000
}
```

You can write something like this in your plugin called `example`:
```js
'use strict';

const config = global['DRTOOLS_PLUGIN_CONFIG_POINTER'];

module.exports = {
    level: () => config.level
};
```

## Options
When you create a new manager you may pass these options in an object as a second
argument:

| Option    |    Type   | Default | Description                                        |
|-----------|:---------:|:-------:|----------------------------------------------------|
| `verbose` | `boolean` |  `true` | Whether to display loading log information or not. |

----
[Back to README](../README.md)
