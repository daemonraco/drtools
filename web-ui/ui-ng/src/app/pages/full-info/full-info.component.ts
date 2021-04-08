import { Component, OnInit } from '@angular/core';

import { DRToolsService } from '../../services';

declare var $: any;

@Component({
    selector: 'app-full-info',
    templateUrl: './full-info.component.html',
})
export class FullInfoComponent implements OnInit {
    //
    // Properties.
    public drtools: any = {};
    //
    // Construction.
    constructor(protected drtSrv: DRToolsService) {
    }
    //
    // Public methods.
    public expandAll(event?: Event): void {
        event && event.preventDefault();
        $('app-full-info .collapse').collapse('show');
    }
    public hideAll(event?: Event): void {
        event && event.preventDefault();
        $('app-full-info .collapse').collapse('hide');
    }
    public async ngOnInit(): Promise<void> {
        this.drtools = await this.drtSrv.info();
    }
    //
    // Protected methods.

}
