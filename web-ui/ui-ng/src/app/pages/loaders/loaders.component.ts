import { Component, OnInit } from '@angular/core';

import { DRToolsService } from 'src/app/services';

declare var $: any;

@Component({
    selector: 'app-loaders',
    templateUrl: './loaders.component.html',
})
export class LoadersComponent implements OnInit {
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
        $('app-loaders .collapse').collapse('show');
    }
    public hideAll(event?: Event): void {
        event && event.preventDefault();
        $('app-loaders .collapse').collapse('hide');
    }
    public async ngOnInit(): Promise<void> {
        this.drtools = await this.drtSrv.info();
        setTimeout(() => this.expandAll(), 0);
    }
    //
    // Protected methods.

}
