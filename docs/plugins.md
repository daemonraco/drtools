<!-- version-check:0.15.4 -->
<!-- version-warning -->
<!-- /version-warning -->

# Plugins

## What is a plugin?
A plugin is a collection of logics you can attach to your application, in the case
of __DRTools__ it simply is a directories with a file called `index.js` that
exports functions.

## How to invoke it
Considering that you have a directory where you store all your plugin directories,
you can do something like this:
```javascript
const { PluginsManager } = require('drtools');
const manager = new PluginsManager('directory/with/plugins');
await manager.load();
```

If you're also making use of the [configs manager](configs.md), you can also do
this to make those configuration easily available inside your plugins:
```javascript
const { ConfigsManager, PluginsManager } = require('drtools');
const configs = new ConfigsManager('directory/with/config/files');
const manager = new PluginsManager('directory/with/plugins', {}, configs);
await manager.load();
```

## Simple plugin
Let's suppose that inside your plugins directory you have another directory called
`example` and inside it a file called `index.js` with this content:
```javascript
'use strict';

module.exports = {
    now: () => new Date(),
};
```

Then you can access it though the plugins manager with something like this:
```javascript
const func = manager.get('example::now');
console.log(`Current date: ${func()}`);
```

## Simpler plugin
Let's suppose that your plugins is even simpler and exports only one function:
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

The prefix `plugin` in your configuration files tell __DRTools__ that they have to
be automatically attached to a plugin when loaded.

## TypeScript
Yes, this manager supports the use of _TypeScript_ and if you use `index.ts`
instead of a _JavaScript_ file, it will try to load it.

## Complex Structures
There are cases where you plugins may not be a simple folder with at least
`index.js` file.
For example, if you're writing your plugin in _TypeScript_ and transpiling it
_JavaScript_ you might end up with file at `dist/index.js` which is not what we
said at the beginning.

For these cases, __DRTools__ can looks inside your plugin directory for
`dist/index`, and if it's not found it looks for `index`.

To activate this behavior, you need to set the option `dist` as `true` when
creating you manager:
```javascript
const { PluginsManager } = require('drtools');
const manager = new PluginsManager('directory/with/plugins', { dist: true });
await manager.load();
```

## Options
When you create a new manager you may pass these options in an object as a second
argument:

| Option          | Type      | Default  | Description                                                            |
|:----------------|:---------:|:--------:|:-----------------------------------------------------------------------|
| `configsPrefix` | `string`  | `plugin` | Configuration file's prefix used to consider them as part of a plugin. |
| `dist`          | `boolean` | `false`  | Whether to consider complex structures on plugins.                     |
| `distPath`      | `string`  | `dist`   | Sub-directory to check first on complex plugin structures.             |
| `verbose`       | `boolean` | `true`   | Whether to display loading log information or not.                     |
