<!-- version-check:0.0.0 -->
<!-- version-warning -->
!>__<span style="color:red">WARNING: THIS DOCUMENT IS OUT OF DATE SINCE VERSION
0.0.0</span>__
<!-- /version-warning -->

# DRTools: Plugins

## What is a plugin?
A plugin is a collection of logics, in the case of __DRTools__ it's a directories
with a file called `index.js` that export functions.

## How to invoke it
Considering that you have a directory where you store all your plugin directories,
you can do something like this:
```javascript
const { PluginsManager } = require('drtools');
const manager = new PluginsManager('directory/with/plugins');
```

If you have a directory where you store your configurations you can also do this:
```javascript
const { ConfigsManager, PluginsManager } = require('drtools');
const configs = new ConfigsManager('directory/with/config/files');
const manager = new PluginsManager('directory/with/plugins', {}, configs);
```

## Simple plugin
Let's suppose that inside your plugins directory you have another directory called
`example` and inside it a file called `index.js` with this content:
```javascript
'use strict';

module.exports = {
    now: () => new Date()
};
```

Then you can invoke it with something like this:
```javascript
const func = manager.get('example::now');
console.log(`Current date: ${func()}`);
```

## Simpler plugin
Let's suppose that your plugins is even simple and exports only one function:
```javascript
'use strict';

module.exports = () => new Date();
```

Then you can invoke it with something like this:
```javascript
const func = manager.get('example::default');
console.log(`Current date: ${func()}`);
```

Or like like this:
```javascript
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
```javascript
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
