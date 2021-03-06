'use strict';

const chalk = require('chalk');

const { Task } = require('../../..');

class ByTheSecondTask extends Task {
    //
    // Public methods.
    description() {
        return 'A simple task that runs every second';
    }
    name() {
        return 'By the Second';
    }
    run() {
        console.log(chalk.magenta(`Running 'ByTheSecondTask': ${new Date()}`));
    }
    //
    // Protected methods.
    load() {
        this._interval = 1000;
        this._runAtStart = true;
    }
}

module.exports = new ByTheSecondTask();
