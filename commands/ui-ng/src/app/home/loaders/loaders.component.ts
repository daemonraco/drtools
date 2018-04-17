import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-loaders',
    templateUrl: './loaders.component.html',
    styles: []
})
export class PageHomeLoadersComponent implements OnInit {
    @Input('loaders') public loaders: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnInit() {
    }
}
