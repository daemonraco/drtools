import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-mockroutes',
    templateUrl: './mock-routes.component.html',
    styles: []
})
export class PageHomeMockRoutesComponent implements OnInit {
    @Input('mockRoutes') public mockRoutes: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnInit() {
    }
}
