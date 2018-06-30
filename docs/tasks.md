# DRTools: Tasks
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is a task?](#what-is-a-task)
- [How to invoke it](#how-to-invoke-it)
    - [How does it look](#how-does-it-look)
- [Options](#options)
- [Required methods](#required-methods)
- [Loading parameters](#loading-parameters)

<!-- /TOC -->

## What is a task?
Tasks are certain pieces of logic that has to be run periodically, this tool
provides a way to orginize them.

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
When you extend the class `Task` you have to conside this methods:

| Name            |    Scope    | Return Type | Optional | Description                              |
|-----------------|:-----------:|:-----------:|:--------:|------------------------------------------|
| `description()` |   `public`  |   `string`  |    Yes   | Returns a brief description of the task. |
| `name()`        |   `public`  |   `string`  |    No    | Clean name of a task.                    |
| `run()`         |   `public`  |    `void`   |    No    | Logic to be run periodically.            |
| `load()`        | `protected` |    `void`   |    No    | Logic to be run periodically.            |

## Loading parameters
When you implemente method `load()` there are a few instance properties you can
set to change behaviors:

| Property           |    Type   | Default | Description                                        |
|--------------------|:---------:|:-------:|----------------------------------------------------|
| `this._interval`   |  `number` |  `5000` | How many milliseconds between each run.            |
| `this._runAtStart` | `boolean` | `false` | Whether to run or not once as soon as it's loaded. |

----
[Back to README](../README.md)
