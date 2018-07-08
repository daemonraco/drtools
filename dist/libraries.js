"use strict";
/**
 * @file libraries.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
exports.ajv = ajv;
const bodyParser = require("body-parser");
exports.bodyParser = bodyParser;
const chalk = require("chalk");
exports.chalk = chalk;
const cheerio = require("cheerio");
exports.cheerio = cheerio;
const commander = require("commander");
exports.commander = commander;
const ejs = require("ejs");
exports.ejs = ejs;
const express = require("express");
exports.express = express;
const fs = require("fs");
exports.fs = fs;
const glob = require("glob");
exports.glob = glob;
const http = require("http");
exports.http = http;
const httpStatusCodes = require("http-status-codes");
exports.httpStatusCodes = httpStatusCodes;
const jsonpath = require("jsonpath-plus");
exports.jsonpath = jsonpath;
const loremIpsum = require("lorem-ipsum");
exports.loremIpsum = loremIpsum;
const marked = require("marked");
exports.marked = marked;
const md5 = require("md5");
exports.md5 = md5;
const mime = require("mime-types");
exports.mime = mime;
const path = require("path");
exports.path = path;
const request = require("request-promise-native");
exports.request = request;
