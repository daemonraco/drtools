import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'ui-home-routes',
    templateUrl: './routes.component.html',
    styles: []
})
export class PageHomeRoutesComponent implements OnInit {
    @Input('routes') public routes: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnInit() {
    }
}
