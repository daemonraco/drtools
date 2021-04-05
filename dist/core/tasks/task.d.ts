/**
 * @file task.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';
export declare abstract class Task {
    protected _configs: ConfigsManager | null;
    protected _interval: number;
    protected _runAtStart: boolean;
    constructor();
    description(): string | null;
    interval(): number;
    name(): string;
    run(): void;
    runAtStart(): boolean;
    setConfigs(configs: ConfigsManager | null): void;
    protected load(): void;
}
