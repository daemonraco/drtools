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
// LoaderssManager related exports.
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
// MySQL to RESTful tools.
export * from './mysql';

//
// Exporting ExpressJS Connector singleton.
import { ExpressConnector as ExpressConnectorClass } from './express';
export const ExpressConnector: ExpressConnectorClass = ExpressConnectorClass.Instance();
