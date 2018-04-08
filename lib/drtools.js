"use strict";
/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./includes/express"));
//
// ConfigsManager related exports.
__export(require("./configs/constants"));
__export(require("./configs/manager"));
//
// LoaderssManager related exports.
__export(require("./loaders/constants"));
__export(require("./loaders/manager"));
//
// MiddlewaressManager related exports.
__export(require("./middlewares/constants"));
__export(require("./middlewares/manager"));
//
// RoutesManager related exports.
__export(require("./routes/constants"));
__export(require("./routes/manager"));
//
// Exporting ExpressJS Connector singleton.
const express_1 = require("./includes/express");
exports.ExpressConnector = express_1.ExpressConnector.Instance();
