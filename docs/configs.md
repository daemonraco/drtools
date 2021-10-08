<!-- version-check:0.15.8 -->
<!-- version-warning -->
<!-- /version-warning -->

# Configs Manager
This tools tries to solve the use of centralizing and organizing configuration
files, either in `json` format or as a `js` file.

## How to invoke it
Let's consider that you have a directory where you store all your configuration
files, in that case you can do something like this:
```javascript
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
```

## Retrieving one
Let's say you have a configuration file named `myconf.config.json` looking like
this stored in your configurations directory:
```json
{
    "min": {
        "height": 768,
        "width": 1024
    }
}
```

Then, you can do something like this:
```javascript
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
const myconf = manager.get('myconf');
console.log(`Minimum height: ${myconf.min.height}`); // --> Minimum height: 768
```

?> Yes, the suffix `.config` is important.

## JS instead of JSON
If you instead have a file called `myconf.config.js` looking like this:
```javascript
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
```javascript
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
In this case you can create a file called `myconf.config.prod.json`, also in the
same directory with this inside:
```json
{
    "min": {
        "height": 720
    }
}
```

Then you set the environment variable `NODE_ENV` to `prod`:
```shell
export NODE_ENV="prod";
```

Now this next code will work a bit different and display values specific for the
environment `prod`:
```javascript
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files');
const myconf = manager.get('myconf');
console.log(`Minimum width: ${myconf.min.width}`); // --> Minimum width: 1024
console.log(`Minimum height: ${myconf.min.height}`); // --> Minimum height: 720
```

As you can see, this loads the file `myconf.config.json` and
`myconf.config.prod.json`, and merges them in that order.

### Environment variables
You may change the environment to load using:
* the environment variable `NODE_ENV` (used from `process.env.NODE_ENV`).
* the environment variable `ENV_NAME` (used from `process.env.ENV_NAME`).
* the global value `NODE_ENV` (used from `global.NODE_ENV`).
* the global value `ENV_NAME` (used from `global.ENV_NAME`).

If none of these is used, then the value is assume to be `default`.

## Multiple directories
If your application have configuration files organized in more than one directory,
you can specify them when you create the manager with something like this:
```javascript
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager([
    'directory/with/configuration/files',
    'directory/with/more-configuration/files',
]);
```

!> If you have multiple files with the same name, the one on the last specified
directory will take priority.

## Specs
This tools has a built-in tool that helps you validate the structure of your
configuration files to avoid misconfigurations.
This tools makes use of JSON-schema specifications (through the package
[Ajv](https://www.npmjs.com/package/ajv)) to validate the structure:

Continuing with the same example, you can create your manager like this:
```javascript
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager([
    'directory/with/configuration/files',
    'directory/with/more-configuration/files',
], {
    specs: 'directory/with/specification/files',
});
```

Now, you can create a file in that directory named `myconf.config-spec.json` with
something like this:
```json
{
    "additionalProperties": false,
    "properties": {
        "min": {
            "additionalProperties": false,
            "properties": {
                "height": {
                    "type": "number"
                },
                "width": {
                    "type": "number"
                }
            },
            "required": [
                "height",
                "width"
            ],
            "type": "object"
        }
    },
    "required": [
        "min"
    ],
    "type": "object"
}
```

?> Yes, the suffix `.config-spec` is important.

?> You can use the page [jsonschemavalidator.net](https://www.jsonschemavalidator.net/)
to test your specifications.

## Environment variables injection
There are some cases where certain values in a configuration shouldn't be in a
configuration file but rather in an environment variable.
For those cases, the configuration manager can help you combine that and use those
values directly from you configuration file.

Let's you have a configuration file with something like this:
```json
{
    "env": "ENV:NODE_ENV"
}
```

Now you can create you manager like this:
```javascript
const { ConfigsManager } = require('drtools');
const manager = new ConfigsManager('directory/with/configuration/files', {
    environmentVariables: true,
});
const myconf = manager.get('myconf');
console.log(`Current environment: ${env}`); // --> Current environment: prod
```

In this example, the field `env` will end up having the value set to the
environment variable `NODE_ENV` or being empty if the variables hasn't been set.

You can also use default values for those cases where the variable may not set
using something like this:
```json
{
    "env": "ENV:NODE_ENV:development"
}
```

## Options
When you create a new manager you may pass these options:

| Option                 |    Type             |  Default         | Description                                                                  |
|------------------------|:-------------------:|:----------------:|------------------------------------------------------------------------------|
| `environmentVariables` | `boolean`           | `false`          | Whether to auto-complete with environment variables or not.                  |
| `key`                  | `string`            | _auto-generated_ | Unique identifier use for internal controls and presentation.                |
| `specs`                | `string` `string[]` | `[]`             | Directories where to look specifications.                                    |
| `specsSuffix`          | `string`            | `config-spec`    | Suffix to be expected on each configuration specification file to be loaded. |
| `suffix`               | `string`            | `config`         | Suffix to be expected on each configuration file to be loaded.               |
| `verbose`              | `boolean`           |  `true`          | Whether to display loading log information or not.                           |
