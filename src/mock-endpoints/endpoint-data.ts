/**
 * @file endpoint-data.ts
 * @author Alejandro D. Simi
 */

import { EndpointBehaviors, EndpointOptions } from '.';
import { Tools } from '../includes';

export class EndpointData {
    //
    // Constants.
    readonly BehaviorPattern = /^@@([a-z_0-9]+)(|:(.*))$/i;
    //
    // Protected properties.
    protected _behaviors: EndpointBehaviors = new EndpointBehaviors();
    protected _options: EndpointOptions = {};
    protected _raw: any = '';
    //
    // Constructor.
    constructor(dummyDataPath: string, options: EndpointOptions = {}) {
        this._options = Tools.DeepMergeObjects(this._options, options);
        this.fixOptions();

        this.loadRaw(dummyDataPath);
        this.loadBehaviors(dummyDataPath);
    }
    //
    // Public methods.
    public data(): any {
        let out = JSON.parse(JSON.stringify(this._raw));
        return this.expanded(out);
    }
    //
    // Protected methods.
    protected expanded(out: any): any {
        const outType = typeof out;

        if (Array.isArray(out)) {
            for (let i = out.length - 1; i >= 0; i--) {
                out[i] = this.expanded(out[i]);
            }
        } else if (outType === 'object') {
            Object.keys(out).forEach(key => {
                out[key] = this.expanded(out[key]);
            });
        } else if (outType === 'string') {
            const match = out.match(this.BehaviorPattern);
            if (match) {
                const behavior = match[1];
                let params = typeof match[3] !== 'undefined' ? match[3] : null;
                try { params = JSON.parse(match[3]); } catch (e) { }

                const func = this._behaviors[behavior];
                if (typeof func === 'function') {
                    out = func.apply(null, Array.isArray(params) ? params : [params]);
                } else {
                    throw `Unknown behavior '${behavior}'.`;
                }
            }
        }

        return out;
    }
    protected fixOptions(): void {
        if (typeof this._options.globalBehaviors === 'string') {
            this._options.globalBehaviors = [this._options.globalBehaviors];
        } else if (!Array.isArray(this._options.globalBehaviors)) {
            this._options.globalBehaviors = [];
        }
    }
    protected loadBehaviors(dummyDataPath: string): void {
        const dummyBehaviorsPath = dummyDataPath.replace(/\.json$/, '.js');

        try {
            const extraBehaviors = require(dummyBehaviorsPath);
            this._behaviors.importBehaviors(extraBehaviors);
        } catch (e) { }

        this.loadGlobalBehaviors();
    }
    protected loadGlobalBehaviors(): void {
        (<string[]>this._options.globalBehaviors).forEach((globalBehaviorsPath: string): void => {
            try {
                const globalBehaviors = require(globalBehaviorsPath);
                this._behaviors.importBehaviors(globalBehaviors);
            } catch (e) {
            }
        });
    }
    protected loadRaw(dummyDataPath: string): void {
        const reqData = require(dummyDataPath);
        this._raw = JSON.parse(JSON.stringify(reqData));
    }
}
