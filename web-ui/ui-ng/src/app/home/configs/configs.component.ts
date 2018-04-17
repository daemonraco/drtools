import { Component, Input, OnInit } from '@angular/core';

import { DRToolsService } from '../../services/drtools.service';

declare var $: any;

@Component({
    selector: 'ui-home-configs',
    templateUrl: './configs.component.html',
    styles: [],
    providers: [DRToolsService]
})
export class PageHomeConfigsComponent implements OnInit {
    @Input('configs') public configs: any = null;
    @Input('server') public server: string = '';

    public configsAsLinks: any[] = [];
    public displayData: any = {};

    constructor(private drtSrv: DRToolsService) {
    }

    public display(config: any): void {
        this.displayData.name = config.name;
        this.displayData.data = `loading...`;
        this.displayData.public = null;

        this.drtSrv.config(config.name).subscribe((data: any) => this.displayData.data = JSON.stringify(data, null, 2));

        $('#ConfigModal').modal('show');
    }
    public rejectLink(reject: boolean, event: any): void {
        if (reject) {
            event.preventDefault();
        }
    }

    ngOnInit() {
    }
}
