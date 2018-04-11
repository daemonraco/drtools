import { ConfigsManager } from '../configs/manager';
import { Endpoint } from '../mock-endpoints/endpoint';
import { EndpointsManagerOptions } from './endpoint-types';
import { ExpressMiddleware } from '../includes/express-types';
export declare class EndpointsManager {
    protected _configs: ConfigsManager;
    protected _provider: Endpoint;
    protected _endpointsDirectory: string;
    protected _endpointsUri: string;
    protected _options: EndpointsManagerOptions;
    constructor(options: EndpointsManagerOptions, configs?: ConfigsManager);
    provide(): ExpressMiddleware;
    protected cleanOptions(): void;
    protected load(): void;
}
