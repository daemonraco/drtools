import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { BooleanComponentTypes } from '../types';

@Component({
    selector: 'app-boolean',
    templateUrl: './boolean.component.html',
})
export class BooleanComponent implements OnInit {
    //
    // Properties.
    @Input() public type: BooleanComponentTypes = BooleanComponentTypes.Default;
    @Input() public value: boolean = false;
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
