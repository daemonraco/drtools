import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { BooleanComponentTypes } from 'src/app/basics';

@Component({
    selector: 'app-section-endpoints',
    templateUrl: './endpoints.component.html',
})
export class EndpointsComponent implements OnInit {
    //
    // Properties.
    @Input() public endpoints: any = null;
    public readonly BooleanComponentTypes = BooleanComponentTypes;
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
