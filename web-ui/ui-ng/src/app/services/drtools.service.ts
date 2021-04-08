import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DRToolsService {
    //
    // Properties.
    protected infoCache: any = null;
    //
    // Construction.
    constructor(protected http: HttpClient) {
    }
    //
    // Public methods.
    public config(name: string, manager: string): Promise<any> {
        return this.http.get(`/.drtools.json?config=${name}&manager=${manager}`).toPromise();
    }
    public configSpecs(name: string, manager: string): Promise<any> {
        return this.http.get(`/.drtools.json?configSpecs=${name}&manager=${manager}`).toPromise();
    }
    public doc(path: string): Promise<any> {
        return this.http.get(`/.drtools.json?doc=${path}`).toPromise();
    }
    public async info(): Promise<any> {
        if (!this.infoCache) {
            this.infoCache = await this.http.get(`/.drtools.json`).toPromise();
        }

        return this.infoCache;
    }
    public publicConfig(name: string): string {
        return `/public-configs/${name}`;
    }
}
