'use strict';

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// Section to be tested @{
const { ExpressConnector } = require('../..');
const { configs } = ExpressConnector.attach(app, {
    configsDirectory: path.join(__dirname, '../tmp/configs'),
    routesDirectory: path.join(__dirname, '../tmp/routes')
});
// @}

app.all('*', (req, res) => {
    res.status(404).json({
        message: `Path '${req.url}' was not found.`
    });
});

http.createServer(app).listen(port, () => {
    console.log(`listening on port ${port}`);
});
