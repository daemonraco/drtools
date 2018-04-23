import { ConfigsManager } from '../configs';
import { EndpointsManager } from '../mock-endpoints';
import { ExpressConnectorAttachResults, ExpressConnectorOptions } from '.';
import { LoadersManager } from '../loaders';
import { MiddlewaresManager } from '../middlewares';
import { MockRoutesManager } from '../mock-routes';
import { RoutesManager } from '../routes';
import { TasksManager } from '../tasks';
export declare class ExpressConnector {
    private static _Instance;
    private constructor();
    attach(app: any, options?: ExpressConnectorOptions): ExpressConnectorAttachResults;
    protected attachConfigs(app: any, options: ExpressConnectorOptions): ConfigsManager;
    protected attachLoaders(options: ExpressConnectorOptions, configs: ConfigsManager): LoadersManager;
    protected attachMiddlewares(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MiddlewaresManager;
    protected attachMockEndpoints(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): EndpointsManager[];
    protected attachMockRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): MockRoutesManager;
    protected attachRoutes(app: any, options: ExpressConnectorOptions, configs: ConfigsManager): RoutesManager;
    protected attachTasks(options: ExpressConnectorOptions, configs: ConfigsManager): TasksManager;
    protected attachWebUI(app: any, options: ExpressConnectorOptions, connectorResults: ExpressConnectorAttachResults): void;
    static Instance(): ExpressConnector;
}
