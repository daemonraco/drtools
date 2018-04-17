import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-endpoints',
    templateUrl: './endpoints.component.html',
    styles: []
})
export class PageHomeEndpointsComponent implements OnInit {
    @Input('endpoints') public endpoints: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnInit() {
    }
}
