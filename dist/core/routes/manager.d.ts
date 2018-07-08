/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { RouteOptions } from '.';
export declare class RoutesManager extends GenericManager<RouteOptions> {
    protected _routes: any[];
    constructor(app: any, directory: string, options: RouteOptions, configs: ConfigsManager);
    routes(): any[];
    protected cleanOptions(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
}
