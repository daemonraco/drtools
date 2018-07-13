import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { LocationService } from './location.service';

@Injectable()
export class DRToolsService {
    constructor(
        private lSrv: LocationService,
        private http: Http) {
    }
    //
    // Public methods.
    public config(name: string, manager: string): Observable<any> {
        return this.http.get(`${this.lSrv.serverUrl()}/.drtools.json?config=${name}&manager=${manager}`).map(data => data.json());
    }
    public configSpecs(name: string, manager: string): Observable<any> {
        return this.http.get(`${this.lSrv.serverUrl()}/.drtools.json?configSpecs=${name}&manager=${manager}`).map(data => data.json());
    }
    public doc(path: string): Observable<any> {
        return this.http.get(`${this.lSrv.serverUrl()}/.drtools.json?doc=${path}`).map(data => data.json());
    }
    public info(): Observable<any> {
        return this.http.get(`${this.lSrv.serverUrl()}/.drtools.json`).map(data => data.json());
    }
    public publicConfig(name: string): string {
        return `${this.lSrv.serverUrl()}/public-configs/${name}`;
    }
}
