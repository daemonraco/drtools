/**
 * @file task.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
export declare abstract class Task {
    protected _configs: ConfigsManager;
    protected _interval: number;
    protected _runAtStart: boolean;
    constructor();
    description(): string;
    interval(): number;
    name(): string;
    run(): void;
    runAtStart(): boolean;
    setConfigs(configs: ConfigsManager): void;
    protected load(): void;
}
