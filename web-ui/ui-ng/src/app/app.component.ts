import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    //
    // Properties.
    public loading: boolean = true;
    public title = 'DRTools';
    //
    // Construction.
    constructor() {
    }
    //
    // Public methods.
    public ngOnInit(): void {
        setTimeout(() => {
            this.loading = false;
        }, 500);
    }
    //
    // Protected methods.

}
