import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { BooleanComponentTypes } from 'src/app/basics';

@Component({
    selector: 'app-section-loaders',
    templateUrl: './loaders.component.html',
})
export class LoadersComponent implements OnInit {
    //
    // Properties.
    @Input() public loaders: any = null;
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
