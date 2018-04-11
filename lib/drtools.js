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
// LoaderssManager related exports.
__export(require("./loaders"));
//
// MiddlewaressManager related exports.
__export(require("./middlewares"));
//
// RoutesManager related exports.
__export(require("./routes"));
//
// Endpoint related exports.
__export(require("./mock-endpoints"));
//
// Exporting ExpressJS Connector singleton.
const express_1 = require("./express");
exports.ExpressConnector = express_1.ExpressConnector.Instance();
