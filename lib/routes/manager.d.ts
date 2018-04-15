import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { RouteOptions } from '.';
export declare class RoutesManager extends GenericManager<RouteOptions> {
    protected _hasSpecialLoad: boolean;
    constructor(app: any, directory: string, options: RouteOptions, configs: ConfigsManager);
    routes(): string[];
    protected cleanOptions(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
}
