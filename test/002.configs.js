'use strict';
//
// Dependencies.
const { assert, expect } = require('chai');
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

        const manager = new ConfigsManager(dir, {
            key: 'test-valid-configs',
        });
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

        expect(manager.directories()).to.have.all.members([dir]);
        assert.strictEqual(manager.environmentName(), 'test');
        assert.strictEqual(manager.getSpecs('unknown'), null);
        expect(manager.itemNames()).to.have.all.members(['db', 'plugin.with-config', 'sizes', 'strict']);
        expect(Object.keys(manager.items())).to.have.all.members(['db', 'plugin.with-config', 'sizes', 'strict']);
        assert.strictEqual(manager.key(), 'test-valid-configs');
        assert(manager.matchesKey('test-valid-configs'));
    });

    it(`tries to load valid configs on a different environment (NODE_ENV)`, () => {
        const oldValue = process.env.NODE_ENV

        try {
            process.env.NODE_ENV = 'prod';

            const dir = path.join(__dirname, 'tmp/configs');
            assert.isTrue(fs.existsSync(dir));

            const manager = new ConfigsManager(dir, {});
            assert.isTrue(manager.valid());

            const dbConf = manager.get('db');
            assert.isObject(dbConf);
            assert.strictEqual(dbConf.w, 555);
            assert.strictEqual(dbConf.x, 666);
            assert.strictEqual(dbConf.y, 2);
            assert.strictEqual(dbConf.z, 3);
            assert.isObject(dbConf.$exports);
            assert.strictEqual(dbConf.$exports.e, 'exported value');
            assert.isObject(dbConf.$pathExports);
            assert.strictEqual(dbConf.$pathExports.exportedX, '$.x');
            assert.strictEqual(dbConf.$pathExports.exportedY, '$.y');

            process.env.NODE_ENV = oldValue;
        } catch (err) {
            process.env.NODE_ENV = oldValue;
            throw err;
        }
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
