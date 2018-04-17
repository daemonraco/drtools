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
        console.log(`Running 'ByTheSecondTask': ${new Date()}`);
    }
    //
    // Protected methods.
    load() {
        this._interval = 1000;
        this._runAtStart = true;
    }
}

const instance = new ByTheSecondTask();

module.exports = instance;
