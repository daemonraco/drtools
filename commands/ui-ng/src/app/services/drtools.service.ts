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
    public info(): Observable<any> {
        return this.http.get(`${this.lSrv.serverUrl()}/.drtools.json`).map(data => data.json());
    }
}
