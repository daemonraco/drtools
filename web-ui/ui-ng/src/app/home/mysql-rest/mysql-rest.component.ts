import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-mysql-rest',
    templateUrl: './mysql-rest.component.html',
    styles: []
})
export class PageHomeMysqlRestComponent implements OnChanges, OnInit {
    @Input('mysqlRest') public mysqlRest: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnChanges() {
        if (this.mysqlRest && Array.isArray(this.mysqlRest.expose)) {
            this.mysqlRest.expose.sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
    }
    ngOnInit() {
    }
}
