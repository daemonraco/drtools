"use strict";
/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
//
// Basic exports.
__export(require("./includes"));
//
// ConfigsManager related exports.
__export(require("./configs"));
//
// LoadersManager related exports.
__export(require("./loaders"));
//
// MiddlewaressManager related exports.
__export(require("./middlewares"));
//
// RoutesManager related exports.
__export(require("./routes"));
//
// TasksManager related exports.
__export(require("./tasks"));
//
// Endpoint related exports.
__export(require("./mock-endpoints"));
//
// Mock-up routes related exports.
__export(require("./mock-routes"));
//
// MySQL to RESTful tools.
__export(require("./mysql"));
//
// PluginsManager related exports.
__export(require("./plugins"));
//
// HTML Web to API related exports.
__export(require("./webtoapi"));
//
// Hooks related exports.
__export(require("./hooks"));
//
// Promisify related exports.
__export(require("./promisify"));
//
// Exporting DRTools Collector singleton.
__export(require("./drcollector"));
//
// Exporting ExpressJS Connector singleton.
const express_1 = require("./express");
exports.ExpressConnector = express_1.ExpressConnector.Instance();
//
// Exporting KoaJS Connector singleton.
const koa_1 = require("./koa");
exports.KoaConnector = koa_1.KoaConnector.Instance();
