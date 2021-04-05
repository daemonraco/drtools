'use strict';

const chalk = require('chalk');

module.exports = (ctx, next) => {
    console.log(`Request: ${chalk.cyan(ctx.originalUrl)}`);
    next();
};
