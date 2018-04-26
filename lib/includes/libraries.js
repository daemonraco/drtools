"use strict";
/**
 * @file libraries.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
exports.ajv = ajv;
const chalk = require("chalk");
exports.chalk = chalk;
const express = require("express");
exports.express = express;
const fs = require("fs");
exports.fs = fs;
const glob = require("glob");
exports.glob = glob;
const jsonpath = require("jsonpath-plus");
exports.jsonpath = jsonpath;
const loremIpsum = require("lorem-ipsum");
exports.loremIpsum = loremIpsum;
const marked = require("marked");
exports.marked = marked;
const mime = require("mime-types");
exports.mime = mime;
const path = require("path");
exports.path = path;
