#!/usr/bin/env node
"use strict";
/**
 * @file cmd.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const server = new server_1.DRToolsServer();
server.run();
