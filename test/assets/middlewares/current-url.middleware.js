'use strict';

const chalk = require('chalk');

module.exports = (req, res, next) => {
    console.log(`Request: ${chalk.cyan(req.originalUrl)}`);
    next();
};
