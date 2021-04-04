import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-loaders',
    templateUrl: './loaders.component.html',
})
export class HomeLoadersComponent implements OnInit {
    //
    // Properties.
    @Input() public loaders: any = null;
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
