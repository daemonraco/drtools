"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaConnector = exports.ExpressConnector = void 0;
const tslib_1 = require("tslib");
/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
//
// Basic exports.
tslib_1.__exportStar(require("./includes"), exports);
//
// ConfigsManager related exports.
tslib_1.__exportStar(require("./configs"), exports);
//
// LoadersManager related exports.
tslib_1.__exportStar(require("./loaders"), exports);
//
// Middlewares Manager related exports.
tslib_1.__exportStar(require("./middlewares"), exports);
//
// RoutesManager related exports.
tslib_1.__exportStar(require("./routes"), exports);
//
// TasksManager related exports.
tslib_1.__exportStar(require("./tasks"), exports);
//
// Endpoint related exports.
tslib_1.__exportStar(require("./mock-endpoints"), exports);
//
// Mock-up routes related exports.
tslib_1.__exportStar(require("./mock-routes"), exports);
//
// PluginsManager related exports.
tslib_1.__exportStar(require("./plugins"), exports);
//
// Hooks related exports.
tslib_1.__exportStar(require("./hooks"), exports);
//
// Exporting DRTools Collector singleton.
tslib_1.__exportStar(require("./drcollector"), exports);
//
// Exporting ExpressJS Connector singleton.
const express_1 = require("./express");
exports.ExpressConnector = express_1.ExpressConnector.Instance();
//
// Exporting KoaJS Connector singleton.
const koa_1 = require("./koa");
exports.KoaConnector = koa_1.KoaConnector.Instance();
