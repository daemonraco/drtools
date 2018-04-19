import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ui-page404',
    templateUrl: './404.component.html',
    styles: []
})
export class Page404Component implements OnInit {
    public uri: string = '';

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.uri = this.router.url;
    }
}
