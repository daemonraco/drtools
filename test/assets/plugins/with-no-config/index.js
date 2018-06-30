'use strict';

const config = global['DRTOOLS_PLUGIN_CONFIG_POINTER'];

module.exports = {
    getConfig: () => {
        return config;
    }
};