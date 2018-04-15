const { Task } = require('../../..');

class ByTheSecondTask extends Task {
    //
    // Public methods.
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
