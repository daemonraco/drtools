import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-routes',
    templateUrl: './routes.component.html',
})
export class HomeRoutesComponent implements OnInit {
    //
    // Properties.
    @Input() public routes: any = null;
    public readonly icons = Icons;
    //
    // Construction.
    constructor() {
    }
    //
    // Public methods.
    public ngOnInit(): void {
    }
    //
    // Protected methods.

}
