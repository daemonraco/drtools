"use strict";
/**
 * @file variables.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ServerVariables {
    constructor() {
        this.availableUrls = [];
        // export const chalkForMethods = {
        //     DELETE: chalk.red,
        //     GET: chalk.green,
        //     POST: chalk.red,
        //     PUT: chalk.yellow,
        //     PATCH: chalk.yellow
        // };
        this.error = null;
        this.connectorOptions = {
            verbose: true
        };
        this.webUI = true;
        this.port = false;
    }
}
exports.ServerVariables = ServerVariables;
