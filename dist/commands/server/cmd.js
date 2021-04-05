#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file cmd.ts
 * @author Alejandro D. Simi
 */
const server_1 = require("./server");
const server = new server_1.DRToolsServer();
server.run();
