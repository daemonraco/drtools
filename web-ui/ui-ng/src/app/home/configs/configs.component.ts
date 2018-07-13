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

    public display(config: any, manager: any): void {
        this.displayData = {};

        this.displayData.name = config.name;
        this.displayData.contents = `loading...`;
        this.displayData.path = `loading...`;

        this.drtSrv.config(config.name, manager.directory)
            .subscribe((data: any) => {
                this.displayData.contents = JSON.stringify(data.contents, null, 2)
                this.displayData.public = data.public;
                this.displayData.path = data.path;
            });

        $('#ConfigModal').modal('show');
    }
    public displaySpecs(config: any, manager: any): void {
        this.displayData = {};

        this.displayData.specsName = config.name;
        this.displayData.contents = `loading...`;
        this.displayData.path = `loading...`;

        this.drtSrv.configSpecs(config.name, manager.directory)
            .subscribe((data: any) => {
                this.displayData.contents = JSON.stringify(data.contents, null, 2)
                this.displayData.path = data.specsPath;
            });

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
