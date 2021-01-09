#!/usr/bin/env node
"use strict";
/**
 * @file cmd.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
const generator = new generator_1.DRToolsGenerator();
generator.run();
