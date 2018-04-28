import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-mockroutes',
    templateUrl: './mock-routes.component.html',
    styles: []
})
export class PageHomeMockRoutesComponent implements OnChanges, OnInit {
    @Input('mockRoutes') public mockRoutes: any = null;
    @Input('server') public server: string = '';

    public hasGuards: boolean = false;

    constructor() {
    }

    ngOnChanges() {
        this.hasGuards = false;
        if (this.mockRoutes && this.mockRoutes.routes) {
            this.mockRoutes.routes.forEach((route: any) => {
                this.hasGuards = this.hasGuards || route.guardPath !== null || route.guardName !== null;
            });
        }
    }
    ngOnInit() {
    }
}
