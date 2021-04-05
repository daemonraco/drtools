#!/usr/bin/env node

/**
 * @file cmd.ts
 * @author Alejandro D. Simi
 */
import { DRToolsServer } from './server';

const server: DRToolsServer = new DRToolsServer();
server.run();
