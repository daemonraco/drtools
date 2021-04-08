import { Component, OnInit } from '@angular/core';

import { DRToolsService } from '../../services';

declare var $: any;

@Component({
    selector: 'app-configs',
    templateUrl: './configs.component.html',
})
export class ConfigsComponent implements OnInit {
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
        $('app-configs .collapse').collapse('show');
    }
    public hideAll(event?: Event): void {
        event && event.preventDefault();
        $('app-configs .collapse').collapse('hide');
    }
    public async ngOnInit(): Promise<void> {
        this.drtools = await this.drtSrv.info();
        setTimeout(() => this.expandAll(), 0);
    }
    //
    // Protected methods.

}
