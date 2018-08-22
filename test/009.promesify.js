'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const util = require('util');

// ---------------------------------------------------------------------------- //
// Testing.
describe(`[009] drtools: Promisify:`, () => {
    const func = (value, cb) => {
        setTimeout(() => cb(`__${value}__`), 10);
    };
    const strategy = functionPointer => {
        return function (value) {
            return new Promise((resolve, reject) => {
                functionPointer(value, resolve);
            });
        }
    }
    const successED = (value, cb) => {
        setTimeout(() => cb(null, `__${value}__`), 10);
    };
    const failED = (value, cb) => {
        setTimeout(() => cb('ERROR', null), 10);
    };
    const successDE = (value, cb) => {
        setTimeout(() => cb(`__${value}__`, null), 10);
    };
    const failDE = (value, cb) => {
        setTimeout(() => cb(null, 'ERROR'), 10);
    };
    const successCECD = (value, ce, cd) => {
        setTimeout(() => cd(`__${value}__`), 10);
    };
    const failCECD = (value, ce, cd) => {
        setTimeout(() => ce('ERROR'), 10);
    };
    const successCDCE = (value, cd, ce) => {
        setTimeout(() => cd(`__${value}__`), 10);
    };
    const failCDCE = (value, cd, ce) => {
        setTimeout(() => ce('ERROR'), 10);
    };
    class Tester {
        func(value, cb) {
            setTimeout(() => cb(`__${value}__`), 10);
        }
        successED(value, cb) {
            setTimeout(() => cb(null, `__${value}__`), 10);
        }
        failED(value, cb) {
            setTimeout(() => cb('ERROR', null), 10);
        }
        set(value, cb) {
            this.value = value;
            setTimeout(() => cb(), 10);
        }
        get(cb) {
            setTimeout(() => cb(this.value), 10);
        }
    }

    const { Promisify, PromisifyStrategies } = require('..');

    it(`masking a simple function with callback (strategy '${PromisifyStrategies.Default}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', func);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a simple function with callback specifing the strategy (strategy '${PromisifyStrategies.Default}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', func, PromisifyStrategies.Default);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a function with callback that gives an error and data (strategy '${PromisifyStrategies.ErrorAndData}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', successED, PromisifyStrategies.ErrorAndData);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a failing function with callback that gives an error and data (strategy '${PromisifyStrategies.ErrorAndData}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', failED, PromisifyStrategies.ErrorAndData);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.isFalse(true, `It should not be here`);
            })
            .catch(err => {
                assert.strictEqual(err, 'ERROR');
            })
            .finally(() => done());
    });

    it(`masking a simple method with callback (strategy '${PromisifyStrategies.Default}')`, done => {
        const maskObject = new Tester();
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerMethodOf);

        assert.notProperty(mask, 'func');
        mask.registerMethodOf('func', maskObject.func, maskObject);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a simple method with callback specifing the strategy (strategy '${PromisifyStrategies.Default}')`, done => {
        const maskObject = new Tester();
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerMethodOf);

        assert.notProperty(mask, 'func');
        mask.registerMethodOf('func', maskObject.func, maskObject, PromisifyStrategies.Default);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a method with callback that gives an error and data (strategy '${PromisifyStrategies.ErrorAndData}')`, done => {
        const maskObject = new Tester();
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerMethodOf);

        assert.notProperty(mask, 'func');
        mask.registerMethodOf('func', maskObject.successED, maskObject, PromisifyStrategies.ErrorAndData);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a failing method with callback that gives an error and data (strategy '${PromisifyStrategies.ErrorAndData}')`, done => {
        const maskObject = new Tester();
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerMethodOf);

        assert.notProperty(mask, 'func');
        mask.registerMethodOf('func', maskObject.failED, maskObject, PromisifyStrategies.ErrorAndData);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.isFalse(true, `It should not be here`);
            })
            .catch(err => {
                assert.strictEqual(err, 'ERROR');
            })
            .finally(() => done());
    });

    it(`checking that data is stored in the right place (strategy '${PromisifyStrategies.Default}')`, done => {
        const maskObject = new Tester();
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerMethodOf);

        assert.notProperty(mask, 'get');
        mask.registerMethodOf('get', maskObject.get, maskObject);
        assert.isFunction(mask.get);

        assert.notProperty(mask, 'set');
        mask.registerMethodOf('set', maskObject.set, maskObject);
        assert.isFunction(mask.set);

        mask.set('George').then(() => null);
        mask.get()
            .then(result => {
                assert.strictEqual(result, 'George');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`checking compatibility with 'util.promisify' (strategy '${PromisifyStrategies.Default}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', func);
        assert.isFunction(mask.func);

        const utilFunc = util.promisify(func);
        utilFunc('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a function with callback that gives data and an error (strategy '${PromisifyStrategies.DataAndError}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', successDE, PromisifyStrategies.DataAndError);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a failing function with callback that gives data and an error (strategy '${PromisifyStrategies.DataAndError}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', failDE, PromisifyStrategies.DataAndError);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.isFalse(true, `It should not be here`);
            })
            .catch(err => {
                assert.strictEqual(err, 'ERROR');
            })
            .finally(() => done());
    });

    it(`masking a simple function with callback (custom strategy)`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', func, strategy);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`checking compatibility with 'util.promisify' (custom strategy)`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', func, strategy);
        assert.isFunction(mask.func);

        const utilFunc = util.promisify(func);
        utilFunc('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a function with double callback for error and data (strategy '${PromisifyStrategies.ErrorAndDataCallbacks}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', successCECD, PromisifyStrategies.ErrorAndDataCallbacks);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a failing function with double callback for error and data (strategy '${PromisifyStrategies.ErrorAndDataCallbacks}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', failCECD, PromisifyStrategies.ErrorAndDataCallbacks);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.isFalse(true, `It should not be here`);
            })
            .catch(err => {
                assert.strictEqual(err, 'ERROR');
            })
            .finally(() => done());
    });

    it(`masking a function with double callback for data and error (strategy '${PromisifyStrategies.DataAndErrorCallbacks}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', successCDCE, PromisifyStrategies.DataAndErrorCallbacks);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.strictEqual(result, '__test__');
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`masking a failing function with double callback for data and error (strategy '${PromisifyStrategies.DataAndErrorCallbacks}')`, done => {
        const mask = new Promisify();
        assert.isObject(mask);
        assert.instanceOf(mask, Promisify);
        assert.isFunction(mask.registerFunction);

        assert.notProperty(mask, 'func');
        mask.registerFunction('func', failCDCE, PromisifyStrategies.DataAndErrorCallbacks);
        assert.isFunction(mask.func);

        mask.func('test')
            .then(result => {
                assert.isFalse(true, `It should not be here`);
            })
            .catch(err => {
                assert.strictEqual(err, 'ERROR');
            })
            .finally(() => done());
    });
});
