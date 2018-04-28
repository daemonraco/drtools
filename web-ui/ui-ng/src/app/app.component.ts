import { Component, OnInit } from '@angular/core';

import { ConnectionService } from './services/connection.service';

@Component({
    selector: 'ui-root',
    templateUrl: `app.component.html`,
    styles: [],
    providers: [ConnectionService]
})
export class AppComponent implements OnInit {
    public loading: boolean = true;
    public online: boolean = false;

    public constructor(private connSrv: ConnectionService) {
    }

    ngOnInit() {
        this.connSrv.isOnline().subscribe((online: boolean) => {
            this.online = online;
            setTimeout(() => {
                this.loading = false;
            }, 500);
        });
    }
}
