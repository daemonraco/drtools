import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-mockroutes',
    templateUrl: './mock-routes.component.html',
    styles: []
})
export class PageHomeMockRoutesComponent implements OnChanges, OnInit {
    @Input('mockRoutes') public mockRoutes: any = null;
    @Input('server') public server: string = '';

    constructor() {
    }

    ngOnChanges() {
        if (this.mockRoutes && Array.isArray(this.mockRoutes)) {
            for (const conf of this.mockRoutes) {
                conf.hasGuards = false;
                if (conf.routes) {
                    conf.routes.forEach((route: any) => {
                        conf.hasGuards = conf.hasGuards || route.guardPath !== null || route.guardName !== null;
                    });
                }
            }
        }
    }
    ngOnInit() {
    }
}
