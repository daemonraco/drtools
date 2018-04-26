/**
 * @file libraries.ts
 * @author Alejandro D. Simi
 */

import * as ajv from 'ajv';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as commander from 'commander';
import * as ejs from 'ejs';
import * as express from 'express';
import * as fs from 'fs';
import * as glob from 'glob';
import * as http from 'http';
import * as jsonpath from 'jsonpath-plus';
import * as loremIpsum from 'lorem-ipsum';
import * as marked from 'marked';
import * as mime from 'mime-types';
import * as path from 'path';

export {
    ajv, bodyParser, commander, chalk, ejs,
    express, fs, glob, http, jsonpath,
    loremIpsum, marked, mime, path
};