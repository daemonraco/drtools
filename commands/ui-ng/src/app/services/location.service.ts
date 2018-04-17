import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class LocationService {
    protected _serverUrl: string = null;

    constructor() {
        const tmpLink = document.createElement('a');
        tmpLink.href = document.location.href;

        this._serverUrl = `${tmpLink.protocol}//${tmpLink.hostname}`;
        if (environment.serverPort) {
            this._serverUrl += `:${environment.serverPort}`;
        } else if (tmpLink.port) {
            this._serverUrl += `:${tmpLink.port}`;
        }
    }
    //
    // Public methods.
    public serverUrl(): string {
        return this._serverUrl;
    }
}
