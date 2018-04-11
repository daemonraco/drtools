'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------- //
// Testing.
describe('drtools: Loaders manager', () => {
    const { ConfigsManager, LoadersManager } = require('..');
    const configs = new ConfigsManager(path.join(__dirname, 'tmp/configs'));

    it(`tries to load loaders from a non-existent directory`, () => {
        const dir = path.join(__dirname, 'not-a-directory');
        assert.isFalse(fs.existsSync(dir));

        const manager = new LoadersManager(dir, {}, configs);
        assert.isFalse(manager.valid());
        assert.match(manager.lastError(), /'.*drtools\/test\/not-a-directory' does not exist/);
    });

    it(`tries to load loaders from a file and not a directory`, () => {
        const dir = path.join(__dirname, 'tmp/loaders/date.loader.js');
        assert.isTrue(fs.existsSync(dir));

        const manager = new LoadersManager(dir, {}, configs);
        assert.isFalse(manager.valid());
        assert.match(manager.lastError(), /'.*drtools\/test\/tmp\/loaders\/date.loader.js' is not a directory/);
    });

    it(`tries to load valid loaders`, () => {
        const dir = path.join(__dirname, 'tmp/loaders');
        assert.isTrue(fs.existsSync(dir));

        const manager = new LoadersManager(dir, {}, configs);
        assert.isTrue(manager.valid());

        assert.strictEqual(global.LOADER_TEST_VALUE, true);
    });
});
