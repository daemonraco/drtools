/**
 * @file drtools.ts
 * @author Alejandro D. Simi
 */
export * from './includes/basic-types';
export * from './includes/express';
export * from './configs/manager';
import { ExpressConnector as ExpressConnectorClass } from './includes/express';
export declare const ExpressConnector: ExpressConnectorClass;
