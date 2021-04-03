import { Component, OnInit } from '@angular/core';

import { DRToolsService } from '../services';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    //
    // Properties.
    public drtools: any = {};
    public serverUrl: string = '';
    //
    // Construction.
    constructor(protected drtSrv: DRToolsService) {
    }
    //
    // Public methods.
    public expandAll(): void {
        $('app-home .collapse').collapse('show');
    }
    public hideAll(): void {
        $('app-home .collapse').collapse('hide');
    }
    public async ngOnInit(): Promise<void> {
        this.drtools = await this.drtSrv.info();
    }
    //
    // Protected methods.

}
