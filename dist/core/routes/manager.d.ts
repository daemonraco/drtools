/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { IRouteOptions } from '.';
export declare class RoutesManager extends GenericManager<IRouteOptions> {
    protected _routes: any[];
    constructor(app: any, directory: string, options: IRouteOptions, configs: ConfigsManager);
    routes(): any[];
    protected cleanOptions(): void;
    protected load(): void;
    protected loadAndAttach(app: any): void;
}
