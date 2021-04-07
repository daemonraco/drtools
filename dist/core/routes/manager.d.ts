/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
import { GenericManager } from '../includes';
import { IRouteOptions } from '.';
export declare class RoutesManager extends GenericManager<IRouteOptions> {
    protected _app: any;
    protected _isKoa: boolean;
    protected _routes: any[];
    constructor(app: any, directories: string[] | string, options: IRouteOptions | undefined, configs: ConfigsManager | null);
    load(): Promise<boolean>;
    routes(): any[];
    protected cleanOptions(): void;
    protected loadAndAttach(): void;
}
