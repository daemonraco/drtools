<!-- version-check:0.15.2 -->
<!-- version-warning -->
<!-- /version-warning -->

# Tasks

## What is a task?
Tasks are pieces of logic that has to be run periodically, __DRTools__ provides a
way to organize them and automatically execute them.

## How to invoke it
Considering that you have a directory where you store all your script files that
export a task object, you can do something like this:
```javascript
const { TasksManager } = require('drtools');
const manager = new TasksManager('directory/with/tasks/files');
await tasks.load();
```

?> Instead of providing one directory, you can provide an array with a list of
directory paths to load tasks from multiple locations.

## How does it look
As an example, let's assume that you need a tas that runs every minute and prints
something, for that you can create a file in your task's directory called
`my-task.task.js` with this content:
```javascript
'use strict';

const { Task } = require('drtools');
class EveryMinuteTask extends Task {
    description() {
        return 'A simple task that runs every minute';
    }
    name() {
        return 'Every Minute';
    }
    async run() {
        console.log(`Running '${this.name()}': ${new Date()}`));
    }
    load() {
        this._interval = 60 * 1000;
        this._runAtStart = false;
    }
}

module.exports = new EveryMinuteTask();
```

## TypeScript tasks
If your use type script in your system, you can write it like this:
```typescript
import { Task } from 'drtools';
class EveryMinuteTask extends Task {
    public description(): string {
        return 'A simple task that runs every minute';
    }
    public name(): string {
        return 'Every Minute';
    }
    public async run(): Promise<void> {
        console.log(`Running '${this.name()}': ${new Date()}`));
    }
    protected load() {
        this._interval = 60 * 1000;
        this._runAtStart = false;
    }
}

export = new EveryMinuteTask();
```

Remember to use the extension `.ts`.

## Required methods
When you extend the class `Task` you have to consider this methods:

| Name            | Scope       | Return Type     | Optional | Description                                           |
|:----------------|:-----------:|:---------------:|:--------:|:------------------------------------------------------|
| `description()` | `public`    | `string`        | Yes      | Returns a brief description of the task.              |
| `load()`        | `protected` | `void`          | Yes      | Pre-configuration logic to run before it's scheduled. |
| `name()`        | `public`    | `string`        | No       | Clean name of a task.                                 |
| `run()`         | `public`    | `Promise<void>` | No       | Logic to be run periodically.                         |

## Loading parameters
When you implement then method `load()` there are a few instance properties you
can set to change behaviors:

| Property           | Type      | Default | Description                                        |
|:-------------------|:---------:|:-------:|:---------------------------------------------------|
| `this._interval`   | `number`  | `5000`  | Milliseconds between each run.                     |
| `this._runAtStart` | `boolean` | `false` | Whether to run or not once as soon as it's loaded. |

## Config files
If you use a configuration files [manager](config.md) in your system, you can
create your tasks manager this way:
```javascript
const { ConfigsManager, TasksManager } = require('drtools');
const configs = new ConfigsManager('directory/with/configuration/files');
const manager = new TasksManager('directory/with/tasks/files', {}, configs);
await tasks.load();
```

And then access it in your tasks like this:
```javascript
'use strict';

const { Task } = require('drtools');
class EveryMinuteTask extends Task {
    description() {
        return 'A simple task that runs every minute';
    }
    name() {
        return 'Every Minute';
    }
    async run() {
        console.log(`Running '${this.name()}': ${new Date()}`));
        console.log(JSON.stringify(this._configs.itemNames())); // prints loaded config names.
    }
    load() {
        this._interval = 60 * 1000;
        this._runAtStart = false;
    }
}

module.exports = new EveryMinuteTask();
```

## Options
When you create a new manager you may pass these options in an object as a second
argument:

| Option       |    Type   | Default | Description                                                                             |
|:-------------|:---------:|:-------:|:----------------------------------------------------------------------------------------|
| `debug`      | `boolean` | `false` | Shows more information of running tasks.                                                |
| `queueTick`  | `number`  | `5000`  | Milliseconds to wait before checking if there's something queued.                       |
| `runAsQueue` | `boolean` | `false` | Whether to avoid running tasks in parallel and enqueue them until there's none running. |
| `suffix`     | `string`  | `task`  | Suffix to be expected on each task file to be loaded.                                   |
| `verbose`    | `boolean` | `true`  | Whether to display loading log information or not.                                      |
