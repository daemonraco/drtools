import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-middlewares',
    templateUrl: './middlewares.component.html',
})
export class HomeMiddlewaresComponent implements OnInit {
    //
    // Properties.
    @Input() public middlewares: any = null;
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
