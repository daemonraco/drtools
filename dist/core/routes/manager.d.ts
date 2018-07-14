/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { IRouteOptions } from '.';
export declare class RoutesManager extends GenericManager<IRouteOptions> {
    protected _expressApp: any;
    protected _routes: any[];
    constructor(app: any, directory: string, options: IRouteOptions, configs: ConfigsManager);
    load(): Promise<boolean>;
    routes(): any[];
    protected cleanOptions(): void;
    protected loadAndAttach(): void;
}
