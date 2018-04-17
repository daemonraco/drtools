import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-tasks',
    templateUrl: './tasks.component.html',
    styles: []
})
export class PageHomeTasksComponent implements OnInit {
    @Input('server') public server: string = '';
    @Input('tasks') public tasks: any = null;

    constructor() {
    }

    ngOnInit() {
    }
}
