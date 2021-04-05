/**
 * @file task.ts
 * @author Alejandro D. Simi
 */
import { ConfigsManager } from '../configs';

export abstract class Task {
    //
    // Protected properties.
    protected _configs: ConfigsManager | null = null;
    protected _interval: number = 5000;
    protected _runAtStart: boolean = false;
    //
    // Constructor.
    public constructor() {
        this.load();
    }
    //
    // Public methods.
    public description(): string | null {
        return null;
    }
    public interval(): number {
        return this._interval;
    }
    public name(): string {
        throw `Subclass responsibility`;
    }
    public run(): void {
        throw `Subclass responsibility`;
    }
    public runAtStart(): boolean {
        return this._runAtStart;
    }
    public setConfigs(configs: ConfigsManager | null): void {
        this._configs = configs;
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected load(): void {
        throw `Subclass responsibility`;
    }
}