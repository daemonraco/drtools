'use strict';
//
// Dependencies.
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
//
// Testing.
describe(`[002] drtools: Configs manager:`, () => {
    const { ConfigsManager } = require('..');

    it(`tries to load configs from a non-existent directory`, () => {
        const dir = path.join(__dirname, 'not-a-directory');
        assert.isFalse(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isFalse(manager.valid());
        assert.match(manager.lastError(), /'.*drtools\/test\/not-a-directory' does not exist/);
    });

    it(`tries to load configs from a file and not a directory`, () => {
        const dir = path.join(__dirname, 'tmp/configs/db.config.json');
        assert.isTrue(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isFalse(manager.valid());
        assert.match(manager.lastError(), /'.*drtools\/test\/tmp\/configs\/db.config.json' is not a directory/);
    });

    it(`tries to load valid configs`, () => {
        const dir = path.join(__dirname, 'tmp/configs');
        assert.isTrue(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isTrue(manager.valid());

        const dbConf = manager.get('db');
        assert.isObject(dbConf);
        assert.notProperty(dbConf, 'w');
        assert.strictEqual(dbConf.x, 1);
        assert.strictEqual(dbConf.y, 2);
        assert.strictEqual(dbConf.z, 3);
        assert.isObject(dbConf.$exports);
        assert.strictEqual(dbConf.$exports.e, 'exported value');
        assert.isObject(dbConf.$pathExports);
        assert.strictEqual(dbConf.$pathExports.exportedX, '$.x');
        assert.strictEqual(dbConf.$pathExports.exportedY, '$.y');
    });

    it(`tries to load valid configs on a different environment (ENV_NAME)`, () => {
        global.ENV_NAME = 'prod';

        const dir = path.join(__dirname, 'tmp/configs');
        assert.isTrue(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isTrue(manager.valid());

        const dbConf = manager.get('db');
        assert.isObject(dbConf);
        assert.strictEqual(dbConf.w, 0);
        assert.strictEqual(dbConf.x, 11);
        assert.strictEqual(dbConf.y, 2);
        assert.strictEqual(dbConf.z, 3);
        assert.isObject(dbConf.$exports);
        assert.strictEqual(dbConf.$exports.e, 'exported value');
        assert.isObject(dbConf.$pathExports);
        assert.strictEqual(dbConf.$pathExports.exportedX, '$.x');
        assert.strictEqual(dbConf.$pathExports.exportedY, '$.y');

        delete global.ENV_NAME;
    });

    it(`tries to load valid configs on a different environment (NODE_ENV)`, () => {
        global.NODE_ENV = 'prod';

        const dir = path.join(__dirname, 'tmp/configs');
        assert.isTrue(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isTrue(manager.valid());

        const dbConf = manager.get('db');
        assert.isObject(dbConf);
        assert.strictEqual(dbConf.w, 0);
        assert.strictEqual(dbConf.x, 11);
        assert.strictEqual(dbConf.y, 2);
        assert.strictEqual(dbConf.z, 3);
        assert.isObject(dbConf.$exports);
        assert.strictEqual(dbConf.$exports.e, 'exported value');
        assert.isObject(dbConf.$pathExports);
        assert.strictEqual(dbConf.$pathExports.exportedX, '$.x');
        assert.strictEqual(dbConf.$pathExports.exportedY, '$.y');

        delete global.NODE_ENV;
    });

    it(`tries use a config based on a JavaScript file`, () => {
        const dir = path.join(__dirname, 'tmp/configs');
        assert.isTrue(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isTrue(manager.valid());

        const sizesConf = manager.get('sizes');
        assert.isObject(sizesConf);
        assert.isObject(sizesConf.min);
        assert.strictEqual(sizesConf.min.height, 768);
        assert.strictEqual(sizesConf.min.width, 1024);
        assert.isFunction(sizesConf.minGeometry);
        assert.strictEqual(sizesConf.minGeometry(), '1024x768');
    });
});
