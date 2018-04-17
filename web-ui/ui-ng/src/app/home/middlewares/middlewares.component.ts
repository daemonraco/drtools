import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-middlewares',
    templateUrl: './middlewares.component.html',
    styles: []
})
export class PageHomeMiddlewaresComponent implements OnInit {
    @Input('middlewares') public middlewares: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnInit() {
    }
}
