import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { RouteOptions } from '.';
export declare class RoutesManager extends GenericManager<RouteOptions> {
    constructor(app: any, directory: string, options: RouteOptions, configs: ConfigsManager);
    protected cleanOptions(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
}
