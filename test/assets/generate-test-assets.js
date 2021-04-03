'use strict';

const fs = require('fs');
const path = require('path');

const pairs = [
    [path.join(__dirname, 'configs'), path.join(__dirname, '../tmp/configs')],
    [path.join(__dirname, 'configs/specs'), path.join(__dirname, '../tmp/configs/specs')],
    [path.join(__dirname, 'endpoints'), path.join(__dirname, '../tmp/endpoints')],
    [path.join(__dirname, 'endpoints/roles'), path.join(__dirname, '../tmp/endpoints/roles')],
    [path.join(__dirname, 'endpoints/users'), path.join(__dirname, '../tmp/endpoints/users')],
    [path.join(__dirname, 'endpoints/_METHODS'), path.join(__dirname, '../tmp/endpoints/_METHODS')],
    [path.join(__dirname, 'endpoints/_METHODS/get'), path.join(__dirname, '../tmp/endpoints/_METHODS/get')],
    [path.join(__dirname, 'endpoints/_METHODS/post'), path.join(__dirname, '../tmp/endpoints/_METHODS/post')],
    [path.join(__dirname, 'loaders'), path.join(__dirname, '../tmp/loaders')],
    [path.join(__dirname, 'middlewares'), path.join(__dirname, '../tmp/middlewares')],
    [path.join(__dirname, 'mock-routes'), path.join(__dirname, '../tmp/mock-routes')],
    [path.join(__dirname, 'plugins'), path.join(__dirname, '../tmp/plugins')],
    [path.join(__dirname, 'plugins/example'), path.join(__dirname, '../tmp/plugins/example')],
    [path.join(__dirname, 'plugins/just-a-function'), path.join(__dirname, '../tmp/plugins/just-a-function')],
    [path.join(__dirname, 'plugins/just-an-array'), path.join(__dirname, '../tmp/plugins/just-an-array')],
    [path.join(__dirname, 'plugins/with-config'), path.join(__dirname, '../tmp/plugins/with-config')],
    [path.join(__dirname, 'plugins/with-no-config'), path.join(__dirname, '../tmp/plugins/with-no-config')],
    [path.join(__dirname, 'routes'), path.join(__dirname, '../tmp/routes')],
    [path.join(__dirname, 'tasks'), path.join(__dirname, '../tmp/tasks')],
];

pairs.forEach(pair => {
    if (!fs.existsSync(pair[1])) {
        console.log(`Creating directory '${pair[1]}'`);
        fs.mkdirSync(pair[1]);
    }
});

pairs.forEach(pair => {
    fs.readdirSync(pair[0])
        .filter(p => p.match(/^.*\.(html|js|json|png|txt)$/i))
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
