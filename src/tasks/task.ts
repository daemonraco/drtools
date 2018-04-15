/**
 * @file task.ts
 * @author Alejandro D. Simi
 */

import { ConfigsManager } from '../configs';

export abstract class Task {
    //
    // Protected properties.
    protected _configs: ConfigsManager = null;
    protected _interval: number = 5000;
    protected _runAtStart: boolean = false;
    //
    // Constructor.
    public constructor() {
        this.load();
    }
    //
    // Public methods.
    public interval(): number {
        return this._interval;
    }
    public run(): void {
        throw `Subclass responsibility`;
    }
    public runAtStart(): boolean {
        return this._runAtStart;
    }
    public setConfigs(configs: ConfigsManager): void {
        this._configs = configs;
    }
    //
    // Protected methods.
    protected load(): void {
        throw `Subclass responsibility`;
    }
}