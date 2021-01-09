"use strict";
/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaConnector = exports.ExpressConnector = void 0;
//
// Basic exports.
__exportStar(require("./includes"), exports);
//
// ConfigsManager related exports.
__exportStar(require("./configs"), exports);
//
// LoadersManager related exports.
__exportStar(require("./loaders"), exports);
//
// MiddlewaressManager related exports.
__exportStar(require("./middlewares"), exports);
//
// RoutesManager related exports.
__exportStar(require("./routes"), exports);
//
// TasksManager related exports.
__exportStar(require("./tasks"), exports);
//
// Endpoint related exports.
__exportStar(require("./mock-endpoints"), exports);
//
// Mock-up routes related exports.
__exportStar(require("./mock-routes"), exports);
//
// MySQL to RESTful tools.
__exportStar(require("./mysql"), exports);
//
// PluginsManager related exports.
__exportStar(require("./plugins"), exports);
//
// HTML Web to API related exports.
__exportStar(require("./webtoapi"), exports);
//
// Hooks related exports.
__exportStar(require("./hooks"), exports);
//
// Promisify related exports.
__exportStar(require("./promisify"), exports);
//
// Exporting DRTools Collector singleton.
__exportStar(require("./drcollector"), exports);
//
// Exporting ExpressJS Connector singleton.
const express_1 = require("./express");
exports.ExpressConnector = express_1.ExpressConnector.Instance();
//
// Exporting KoaJS Connector singleton.
const koa_1 = require("./koa");
exports.KoaConnector = koa_1.KoaConnector.Instance();
