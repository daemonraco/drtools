import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

@Injectable()
export class ConnectionService {
    constructor(private http: Http) {
    }
    //
    // Public methods.
    public isOnline(): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            this.http.get(`https://bootswatch.com`)
                .subscribe(data => {
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                });
        });
    }
}
