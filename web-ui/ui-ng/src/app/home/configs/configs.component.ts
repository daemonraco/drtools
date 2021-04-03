import { Component, Input, OnInit } from '@angular/core';
import { DRToolsService } from 'src/app/services';
import * as Icons from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
    selector: 'app-home-configs',
    templateUrl: './configs.component.html',
})
export class ConfigsComponent implements OnInit {
    //
    // Properties.
    @Input() public configs: any = null;
    public configsAsLinks: any[] = [];
    public displayData: any = {};
    public readonly icons = Icons;
    //
    // Construction.
    constructor(protected drtSrv: DRToolsService) {
    }
    //
    // Public methods.
    public async display(config: any, manager: any): Promise<void> {
        this.displayData = {};

        this.displayData.name = config.name;
        this.displayData.contents = `loading...`;
        this.displayData.path = `loading...`;

        const data: any = await this.drtSrv.config(config.name, manager.directory);
        this.displayData.contents = JSON.stringify(data.contents, null, 2);
        this.displayData.public = data.public;
        this.displayData.path = data.path;

        $('#ConfigModal').modal('show');
    }
    public async displaySpecs(config: any, manager: any): Promise<void> {
        this.displayData = {};

        this.displayData.specsName = config.name;
        this.displayData.contents = `loading...`;
        this.displayData.path = `loading...`;

        const data: any = await this.drtSrv.configSpecs(config.name, manager.directory);
        this.displayData.contents = JSON.stringify(data.contents, null, 2)
        this.displayData.path = data.specsPath;

        $('#ConfigModal').modal('show');
    }
    public ngOnInit(): void {
    }
    public rejectLink(reject: boolean, event: any): void {
        if (reject) {
            event.preventDefault();
        }
    }
    //
    // Protected methods.
}
