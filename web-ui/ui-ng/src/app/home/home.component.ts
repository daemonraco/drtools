import { Component, OnInit } from '@angular/core';

import { DRToolsService } from '../services/drtools.service';
import { LocationService } from '../services/location.service';

@Component({
    selector: 'ui-home',
    templateUrl: './home.component.html',
    styles: [],
    providers: [DRToolsService]
})
export class PageHomeComponent implements OnInit {
    public drtools: any = {};
    public serverUrl: string = '';

    constructor(
        private drtSrv: DRToolsService,
        private lSrv: LocationService) {
    }

    ngOnInit() {
        this.serverUrl = this.lSrv.serverUrl();
        this.drtSrv.info().subscribe(data => {
            console.log(`DEBUG`, JSON.stringify(data, null, 2));
            this.drtools = data
        });
    }
}
