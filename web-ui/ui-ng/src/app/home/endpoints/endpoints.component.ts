import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-endpoints',
    templateUrl: './endpoints.component.html',
})
export class EndpointsComponent implements OnInit {
    //
    // Properties.
    @Input() public endpoints: any = null;
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
