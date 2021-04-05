<!-- version-warning -->
!>__<span style="color:red">WARNING: THIS DOCUMENT IS OUT OF DATE SINCE VERSION
0.5.0</span>__
<!-- /version-warning -->

# DRTools: Tasks

## What is a task?
Tasks are certain pieces of logic that has to be run periodically, this tool
provides a way to organize them.

## How to invoke it
Considering that you have a directory where you store all your scripts files
that export a task object, you can do something like this:
```js
const { TasksManager } = require('drtools');
const manager = new TasksManager('directory/with/tasks/files');
```

### How does it look
If you wonder how a _task_ you can use looks like, this is a simple example:
```js
'use strict';

const { Task } = require('drtools');
class EveryMinuteTask extends Task {
    description() {
        return 'A simple task that runs every minute';
    }
    name() {
        return 'Every Minute';
    }
    run() {
        console.log(`Running '${this.name()}': ${new Date()}`));
    }
    load() {
        this._interval = 60 * 1000;
        this._runAtStart = false;
    }
}

const instance = new EveryMinuteTask();
module.exports = instance;
```

## Options
When you create a new manager you may pass these options in an object as a second
argument:

| Option    |    Type   | Default | Description                                           |
|-----------|:---------:|:-------:|-------------------------------------------------------|
| `suffix`  |  `string` |  `task` | Suffix to be expected on each task file to be loaded. |
| `verbose` | `boolean` |  `true` | Whether to display loading log information or not.    |

## Required methods
When you extend the class `Task` you have to consider this methods:

| Name            |    Scope    | Return Type | Optional | Description                              |
|-----------------|:-----------:|:-----------:|:--------:|------------------------------------------|
| `description()` |   `public`  |   `string`  |    Yes   | Returns a brief description of the task. |
| `name()`        |   `public`  |   `string`  |    No    | Clean name of a task.                    |
| `run()`         |   `public`  |    `void`   |    No    | Logic to be run periodically.            |
| `load()`        | `protected` |    `void`   |    No    | Logic to be run periodically.            |

## Loading parameters
When you implement method `load()` there are a few instance properties you can
set to change behaviors:

| Property           |    Type   | Default | Description                                        |
|--------------------|:---------:|:-------:|----------------------------------------------------|
| `this._interval`   |  `number` |  `5000` | How many milliseconds between each run.            |
| `this._runAtStart` | `boolean` | `false` | Whether to run or not once as soon as it's loaded. |

<!-- version-check:0.5.0 -->
