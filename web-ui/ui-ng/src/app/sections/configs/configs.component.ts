import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { BooleanComponentTypes } from 'src/app/basics';
import { DRToolsService } from 'src/app/services';

declare var $: any;

@Component({
    selector: 'app-section-configs',
    templateUrl: './configs.component.html',
})
export class ConfigsComponent implements OnChanges, OnInit {
    //
    // Properties.
    @Input() public configs: any;
    public configsAsLinks: any[] = [];
    public displayData: any = {};
    public readonly BooleanComponentTypes = BooleanComponentTypes;
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

        const data: any = await this.drtSrv.config(config.name, manager.key);
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

        const data: any = await this.drtSrv.configSpecs(config.name, manager.key);
        this.displayData.contents = JSON.stringify(data.contents, null, 2)
        this.displayData.path = data.specsPath;

        $('#ConfigModal').modal('show');
    }
    public ngOnChanges(): void {
        this.load();
    }
    public ngOnInit(): void {
        this.load();
    }
    public rejectLink(reject: boolean, event: any): void {
        if (reject) {
            event.preventDefault();
        }
    }
    //
    // Protected methods.
    protected load(): void {
        if (this.configs) {
            for (const item of this.configs) {
                item._items = Object.entries(item.items).map((x: [string, any]) => x[1]);
                item._specs = Object.entries(item.specs).map((x: [string, any]) => x[1]);
            }
        }
    }
}
