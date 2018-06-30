'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------- //
// Testing.
describe(`[008] drtools: Plugins manager:`, () => {
    const checkPluginNames = manager => {
        const pluginNames = manager.itemNames();

        assert.isArray(pluginNames);
        assert.include(pluginNames, 'example');
        assert.include(pluginNames, 'just-a-function');
        assert.include(pluginNames, 'just-an-array');
        assert.include(pluginNames, 'with-config');
        assert.include(pluginNames, 'with-no-config');
    };
    const dateToBasicString = d => {
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}-${d.getHours()}-${d.getMinutes()}`;
    }

    const { ConfigsManager, PluginsConstants, PluginsManager } = require('..');
    const configs = new ConfigsManager(path.join(__dirname, 'tmp/configs'));
    let mainManager = null;

    it(`tries to load plugins from a non-existent directory`, () => {
        const dir = path.join(__dirname, 'not-a-directory');
        assert.isFalse(fs.existsSync(dir));

        const manager = new PluginsManager(dir, {}, configs);
        assert.isFalse(manager.valid());
        assert.match(manager.lastError(), /'.*drtools\/test\/not-a-directory' does not exist/);
    });

    it(`tries to load plugins from a valid directory`, () => {
        const dir = path.join(__dirname, 'tmp/plugins');
        assert.isTrue(fs.existsSync(dir));

        mainManager = new PluginsManager(dir, {}, configs);
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        checkPluginNames(mainManager);
    });

    it(`tries to load plugins from a list of valid directories`, () => {
        const dir = path.join(__dirname, 'tmp/plugins');
        assert.isTrue(fs.existsSync(dir));

        const manager = new PluginsManager([dir], {}, configs);
        assert.isTrue(manager.valid());
        assert.isNull(manager.lastError());

        checkPluginNames(manager);
    });

    it(`checks a non existing plugin`, () => {
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        const methods = mainManager.methodsOf('not-a-plugin');
        assert.isArray(methods);
        assert.strictEqual(methods.length, 0);
    });

    it(`checks a simple plugin`, () => {
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        const methods = mainManager.methodsOf('example');
        assert.isArray(methods);
        assert.include(methods, 'now');
        assert.include(methods, 'yesterday');

        const auxDate = new Date();

        const now = mainManager.get('example::now');
        assert.isFunction(now);
        assert.strictEqual(dateToBasicString(now()), dateToBasicString(auxDate));

        auxDate.setHours(auxDate.getHours() - 24);

        const yesterday = mainManager.get('example::yesterday');
        assert.isFunction(yesterday);
        assert.strictEqual(dateToBasicString(yesterday()), dateToBasicString(auxDate));

        const defaultDirectFunction = mainManager.get(`example`);
        assert.isNull(defaultDirectFunction);

        const defaultFunction = mainManager.get(`example::${PluginsConstants.DefaultMethod}`);
        assert.isNull(defaultFunction);
    });

    it(`checks a plugin that exposes only a function`, () => {
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        const methods = mainManager.methodsOf('just-a-function');
        assert.isArray(methods);
        assert.include(methods, PluginsConstants.DefaultMethod);

        const auxDate = new Date();

        const defaultDirectFunction = mainManager.get(`just-a-function`);
        assert.isFunction(defaultDirectFunction);
        assert.strictEqual(dateToBasicString(defaultDirectFunction()), dateToBasicString(auxDate));

        const defaultFunction = mainManager.get(`just-a-function::${PluginsConstants.DefaultMethod}`);
        assert.isFunction(defaultFunction);
        assert.strictEqual(dateToBasicString(defaultFunction()), dateToBasicString(auxDate));
    });

    it(`checks a plugin that exposes only an array`, () => {
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        const methods = mainManager.methodsOf('just-an-array');
        assert.isArray(methods);
        assert.include(methods, PluginsConstants.DefaultMethod);

        const defaultDirectFunction = mainManager.get(`just-an-array`);
        assert.isArray(defaultDirectFunction);
        assert.include(defaultDirectFunction, 1);
        assert.include(defaultDirectFunction, "2");
        assert.include(defaultDirectFunction, .3);

        const defaultFunction = mainManager.get(`just-an-array::${PluginsConstants.DefaultMethod}`);
        assert.isArray(defaultFunction);
        assert.include(defaultFunction, 1);
        assert.include(defaultFunction, "2");
        assert.include(defaultFunction, .3);
    });

    it(`checks a plugin with configuration`, () => {
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        const methods = mainManager.methodsOf('with-config');
        assert.isArray(methods);
        assert.include(methods, 'getConfig');

        const getConfig = mainManager.get('with-config::getConfig');
        assert.isFunction(getConfig);

        const config = getConfig();
        assert.isObject(config);
        assert.property(config, 'hello');
        assert.strictEqual(config.hello, 'world!');

        const defaultDirectFunction = mainManager.get(`with-config`);
        assert.isNull(defaultDirectFunction);

        const defaultFunction = mainManager.get(`with-config::${PluginsConstants.DefaultMethod}`);
        assert.isNull(defaultFunction);
    });

    it(`checks a plugin with no configuration`, () => {
        assert.isTrue(mainManager.valid());
        assert.isNull(mainManager.lastError());

        const methods = mainManager.methodsOf('with-no-config');
        assert.isArray(methods);
        assert.include(methods, 'getConfig');

        const getConfig = mainManager.get('with-no-config::getConfig');
        assert.isFunction(getConfig);

        const config = getConfig();
        assert.isObject(config);
        assert.strictEqual(Object.keys(config).length, 0);

        const defaultDirectFunction = mainManager.get(`with-no-config`);
        assert.isNull(defaultDirectFunction);

        const defaultFunction = mainManager.get(`with-no-config::${PluginsConstants.DefaultMethod}`);
        assert.isNull(defaultFunction);
    });
});
