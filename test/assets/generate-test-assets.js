'use strict';

const fs = require('fs');
const path = require('path');

//
// Configs @{
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
// @}

//
// Routes @{
const originalsRoutesDirectory = path.join(__dirname, './routes');
const routesDirectory = path.join(__dirname, '../tmp/routes');
if (!fs.existsSync(routesDirectory)) {
    fs.mkdirSync(routesDirectory);
}
fs.readdirSync(originalsRoutesDirectory)
    .map(p => {
        return {
            from: path.join(originalsRoutesDirectory, p),
            to: path.join(routesDirectory, p)
        }
    })
    .forEach(o => {
        console.log(`Copying '${o.from}' to '${o.to}'`);
        fs.writeFileSync(o.to, fs.readFileSync(o.from).toString());
    });
// @}

//
// Middlewares @{
const originalsMiddlewaresDirectory = path.join(__dirname, './middlewares');
const middlewaresDirectory = path.join(__dirname, '../tmp/middlewares');
if (!fs.existsSync(middlewaresDirectory)) {
    fs.mkdirSync(middlewaresDirectory);
}
fs.readdirSync(originalsMiddlewaresDirectory)
    .map(p => {
        return {
            from: path.join(originalsMiddlewaresDirectory, p),
            to: path.join(middlewaresDirectory, p)
        }
    })
    .forEach(o => {
        console.log(`Copying '${o.from}' to '${o.to}'`);
        fs.writeFileSync(o.to, fs.readFileSync(o.from).toString());
    });
// @}
