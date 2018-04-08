/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */

//
// Basic exports.
export * from './includes/basic-types';
export * from './includes/express';

//
// ConfigsManager related exports.
export * from './configs/constants';
export * from './configs/manager';

//
// RoutesManager related exports.
export * from './routes/constants';
export * from './routes/manager';

//
// Exporting ExpressJS Connector singleton.
import { ExpressConnector as ExpressConnectorClass } from './includes/express';
export const ExpressConnector: ExpressConnectorClass = ExpressConnectorClass.Instance();
