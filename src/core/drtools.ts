/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
//
// Basic exports.
export * from './includes';
//
// ConfigsManager related exports.
export * from './configs';
//
// LoadersManager related exports.
export * from './loaders';
//
// MiddlewaressManager related exports.
export * from './middlewares';
//
// RoutesManager related exports.
export * from './routes';
//
// TasksManager related exports.
export * from './tasks';
//
// Endpoint related exports.
export * from './mock-endpoints';
//
// Mock-up routes related exports.
export * from './mock-routes';
//
// PluginsManager related exports.
export * from './plugins';
//
// Hooks related exports.
export * from './hooks';
//
// Promisify related exports.
export * from './promisify';
//
// Exporting DRTools Collector singleton.
export * from './drcollector';
//
// Exporting ExpressJS Connector singleton.
import { ExpressConnector as ExpressConnectorClass } from './express';
export const ExpressConnector: ExpressConnectorClass = ExpressConnectorClass.Instance();

//
// Exporting KoaJS Connector singleton.
import { KoaConnector as KoaConnectorClass } from './koa';
export const KoaConnector: KoaConnectorClass = KoaConnectorClass.Instance();
