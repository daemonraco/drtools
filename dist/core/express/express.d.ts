/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary } from '../includes';
import { ConfigsManager } from '../configs';
import { EndpointsManager } from '../mock-endpoints';
import { ExpressConnectorAttachResults, ExpressConnectorOptions, WebToApiOptions } from '.';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { MySQLRestManager } from '../mysql';
import { PluginsManager } from '../plugins';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';
import { WebToApi } from '../webtoapi';
export declare class ExpressConnector {
    private static _Instance;
    protected _attachments: ExpressConnectorAttachResults;
    protected _uiAttached: boolean;
    private constructor();
    attachments(): ExpressConnectorAttachResults;
    attach(app: any, options?: ExpressConnectorOptions): ExpressConnectorAttachResults;
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager;
    protected attachLoaders(options: ExpressConnectorOptions, configs: ConfigsManager): LoadersManager;
    protected attachMiddlewares(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MiddlewaresManager;
    protected attachMockEndpoints(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): EndpointsManager[];
    protected attachMockRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MockRoutesManager;
    protected attachMySQLRest(app: any, options: ExpressConnectorOptions): MySQLRestManager;
    protected attachPlugins(options: ExpressConnectorOptions, configs: ConfigsManager): PluginsManager;
    protected attachRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): RoutesManager;
    protected attachTasks(options: ExpressConnectorOptions, configs: ConfigsManager): TasksManager;
    protected attachWebToApi(app: any, options: WebToApiOptions[]): BasicDictionary<WebToApi>;
    protected attachWebUI(app: any, options: ExpressConnectorOptions): void;
    static Instance(): ExpressConnector;
}
