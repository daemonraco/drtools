import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
    selector: 'app-home-plugins',
    templateUrl: './plugins.component.html',
})
export class PluginsComponent implements OnInit {
    //
    // Properties.
    @Input() public plugins: any = null;
    public displayData: any = {};
    public readonly icons = Icons;
    //
    // Construction.
    constructor() {
    }
    //
    // Public methods.
    public displayConfig(plugin: any): void {
        this.displayData = {};

        this.displayData.name = plugin.name;
        this.displayData.configName = plugin.configName;
        this.displayData.contents = JSON.stringify(plugin.config, null, 2)

        $('#PluginConfigModal').modal('show');
    }
    public ngOnInit(): void {
    }
    //
    // Protected methods.

}
