'use strict';
//
// Dependencies.
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
//
// Testing.
describe(`[003] drtools: Loaders manager:`, () => {
    const { ConfigsManager, LoadersManager } = require('..');
    const configs = new ConfigsManager(path.join(__dirname, 'tmp/configs'));

    it(`tries to load loaders from a non-existent directory`, done => {
        const dir = path.join(__dirname, 'not-a-directory');
        assert.isFalse(fs.existsSync(dir));

        const manager = new LoadersManager(dir, {}, configs);
        manager.load()
            .then(() => {
                assert.isFalse(manager.valid());
                assert.match(manager.lastError(), /'.*drtools\/test\/not-a-directory' does not exist/);
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`tries to load loaders from a file and not a directory`, done => {
        const dir = path.join(__dirname, 'tmp/loaders/date.loader.js');
        assert.isTrue(fs.existsSync(dir));

        const manager = new LoadersManager(dir, {}, configs);
        manager.load()
            .then(() => {
                assert.isFalse(manager.valid());
                assert.match(manager.lastError(), /\/test\/tmp\/loaders\/date.loader.js'/);
                assert.match(manager.lastError(), /not a directory/);
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });

    it(`tries to load valid loaders`, done => {
        const dir = path.join(__dirname, 'tmp/loaders');
        assert.isTrue(fs.existsSync(dir));

        const manager = new LoadersManager(dir, {}, configs);
        manager.load()
            .then(() => {
                assert.isTrue(manager.valid());

                assert.strictEqual(global.LOADER_TEST_VALUE, true);
            })
            .catch(err => {
                assert.isFalse(true, `Error: ${err}`);
            })
            .finally(() => done());
    });
});
