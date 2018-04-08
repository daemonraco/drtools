'use strict';

const fs = require('fs');
const path = require('path');

const configsDirectory = path.join(__dirname, '../tmp/configs');
if (!fs.existsSync(configsDirectory)) {
    fs.mkdirSync(configsDirectory);
}
const dbConfigPath = path.join(configsDirectory, 'db.config.json');
fs.writeFileSync(dbConfigPath, JSON.stringify({
    x: 1, y: 2, z: 3,
    $exports: {
        e: 'exported value'
    },
    $pathExports: {
        exportedX: '$.x',
        exportedY: '$.y'
    }
}, null, 2));
