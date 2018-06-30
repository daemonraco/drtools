import { Component, Input, OnChanges, OnInit } from '@angular/core';

declare var $: any;

@Component({
    selector: 'ui-home-plugins',
    templateUrl: './plugins.component.html',
    styles: []
})
export class PageHomePluginsComponent implements OnChanges, OnInit {
    @Input('plugins') public plugins: any = null;
    @Input('server') public server: string = '';
    
    public displayData: any = {};

    constructor() {
    }

    public displayConfig(plugin: any): void {
        this.displayData = {};

        this.displayData.name = plugin.name;
        this.displayData.configName = plugin.configName;
        this.displayData.contents = JSON.stringify(plugin.config, null, 2)

        $('#PluginConfigModal').modal('show');
    }

    ngOnChanges() {
    }
    ngOnInit() {
    }
}
