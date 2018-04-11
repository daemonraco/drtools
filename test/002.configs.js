'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------- //
// Testing.
describe('drtools: Configs manager', () => {
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
        assert.isNumber(dbConf.x);
        assert.equal(dbConf.x, 1);
        assert.isNumber(dbConf.y);
        assert.equal(dbConf.y, 2);
        assert.isNumber(dbConf.z);
        assert.equal(dbConf.z, 3);
        assert.isObject(dbConf.$exports);
        assert.isString(dbConf.$exports.e);
        assert.equal(dbConf.$exports.e, 'exported value');
        assert.isObject(dbConf.$pathExports);
        assert.isString(dbConf.$pathExports.exportedX);
        assert.equal(dbConf.$pathExports.exportedX, '$.x');
        assert.isString(dbConf.$pathExports.exportedY);
        assert.equal(dbConf.$pathExports.exportedY, '$.y');
    });

    it(`tries to load valid configs on a different environment (ENV_NAME)`, () => {
        global.ENV_NAME = 'prod';

        const dir = path.join(__dirname, 'tmp/configs');
        assert.isTrue(fs.existsSync(dir));

        const manager = new ConfigsManager(dir, {});
        assert.isTrue(manager.valid());

        const dbConf = manager.get('db');
        assert.isObject(dbConf);
        assert.isNumber(dbConf.w);
        assert.equal(dbConf.w, 0);
        assert.isNumber(dbConf.x);
        assert.equal(dbConf.x, 11);
        assert.isNumber(dbConf.y);
        assert.equal(dbConf.y, 2);
        assert.isNumber(dbConf.z);
        assert.equal(dbConf.z, 3);
        assert.isObject(dbConf.$exports);
        assert.isString(dbConf.$exports.e);
        assert.equal(dbConf.$exports.e, 'exported value');
        assert.isObject(dbConf.$pathExports);
        assert.isString(dbConf.$pathExports.exportedX);
        assert.equal(dbConf.$pathExports.exportedX, '$.x');
        assert.isString(dbConf.$pathExports.exportedY);
        assert.equal(dbConf.$pathExports.exportedY, '$.y');

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
        assert.isNumber(dbConf.w);
        assert.equal(dbConf.w, 0);
        assert.isNumber(dbConf.x);
        assert.equal(dbConf.x, 11);
        assert.isNumber(dbConf.y);
        assert.equal(dbConf.y, 2);
        assert.isNumber(dbConf.z);
        assert.equal(dbConf.z, 3);
        assert.isObject(dbConf.$exports);
        assert.isString(dbConf.$exports.e);
        assert.equal(dbConf.$exports.e, 'exported value');
        assert.isObject(dbConf.$pathExports);
        assert.isString(dbConf.$pathExports.exportedX);
        assert.equal(dbConf.$pathExports.exportedX, '$.x');
        assert.isString(dbConf.$pathExports.exportedY);
        assert.equal(dbConf.$pathExports.exportedY, '$.y');

        delete global.NODE_ENV;
    });
});
