import { ConfigsManager } from '../configs';
import { ExpressConnectorAttachResults } from '.';
export declare class ExpressResponseBuilder {
    private constructor();
    static ConfigContents(manager: ConfigsManager, name: string): any;
    static ConfigSpecsContents(manager: ConfigsManager, name: string): any;
    static FullInfoResponse(managers: ExpressConnectorAttachResults): any;
}
