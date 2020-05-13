/**
 * @file libraries.ts
 * @author Alejandro D. Simi
 */
import * as EventEmitter from 'events';
import * as KoaRouter from 'koa-router';
import * as ajv from 'ajv';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as cheerio from 'cheerio';
import * as commander from 'commander';
import * as ejs from 'ejs';
import * as express from 'express';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as http from 'http';
import * as httpStatusCodes from 'http-status-codes';
import * as koa from 'koa';
import * as koaSend from 'koa-send';
import * as koaStatic from 'koa-static';
import * as loremIpsum from 'lorem-ipsum';
import * as marked from 'marked';
import * as md5 from 'md5';
import * as mime from 'mime-types';
import * as path from 'path';
import * as request from 'request-promise-native';
import * as url from 'url';
import * as util from 'util';
import { JSONPath } from 'jsonpath-plus';
export { KoaRouter, EventEmitter, ajv, bodyParser, chalk, cheerio, commander, ejs, express, fs, glob, http, httpStatusCodes, JSONPath as jsonpath, koa, koaSend, koaStatic, loremIpsum, marked, md5, mime, path, request, url, util };
