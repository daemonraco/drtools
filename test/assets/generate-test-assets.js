'use strict';

const fs = require('fs');
const path = require('path');

const pairs = [
    [path.join(__dirname, 'configs'), path.join(__dirname, '../tmp/configs')],
    [path.join(__dirname, 'endpoints'), path.join(__dirname, '../tmp/endpoints')],
    [path.join(__dirname, 'endpoints/users'), path.join(__dirname, '../tmp/endpoints/users')],
    [path.join(__dirname, 'loaders'), path.join(__dirname, '../tmp/loaders')],
    [path.join(__dirname, 'middlewares'), path.join(__dirname, '../tmp/middlewares')],
    [path.join(__dirname, 'routes'), path.join(__dirname, '../tmp/routes')]
];

pairs.forEach(pair => {
    if (!fs.existsSync(pair[1])) {
        console.log(`Creating directory '${pair[1]}'`);
        fs.mkdirSync(pair[1]);
    }
});

pairs.forEach(pair => {
    fs.readdirSync(pair[0])
        .filter(p => p.match(/^.*\.(js|json)$/i))
        .map(p => {
            return {
                from: path.join(pair[0], p),
                to: path.join(pair[1], p)
            }
        })
        .forEach(o => {
            console.log(`Copying '${o.from}' to '${o.to}'`);
            fs.writeFileSync(o.to, fs.readFileSync(o.from).toString());
        });
});
