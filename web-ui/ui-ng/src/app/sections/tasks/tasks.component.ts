import { Component, Input, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-section-tasks',
    templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
    //
    // Properties.
    @Input() public tasks: any = null;
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