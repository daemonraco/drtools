import { GenericManager } from '../includes';
import { LoaderOptions } from '.';
export declare class LoadersManager extends GenericManager<LoaderOptions> {
    protected cleanOptions(): void;
    protected load(): void;
}
