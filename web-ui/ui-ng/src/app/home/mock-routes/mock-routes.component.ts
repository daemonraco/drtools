import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-mock-routes',
    templateUrl: './mock-routes.component.html',
})
export class MockRoutesComponent implements OnChanges, OnInit {
    //
    // Properties.
    @Input() public mockRoutes: any = null;
    public readonly icons = Icons;
    //
    // Construction.
    constructor() {
    }
    //
    // Public methods.
    public ngOnChanges(): void {
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
    public ngOnInit(): void {
    }
    //
    // Protected methods.
}
