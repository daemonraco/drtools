import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'ui-home-configs',
    templateUrl: './configs.component.html',
    styles: []
})
export class PageHomeConfigsComponent implements OnChanges, OnInit {
    @Input('configs') public configs: any = null;
    @Input('server') public server: string = '';

    public configsAsLinks: any[] = [];

    constructor() {
    }

    public rejectLink(reject: boolean, event: any): void {
        if (reject) {
            event.preventDefault();
        }
    }

    ngOnChanges() {
        if (this.configs) {
            const aux: any[] = [];

            this.configs.names.sort().forEach(name => {
                aux.push({
                    name,
                    link: this.configs.publicNames.indexOf(name) > -1 ? `/public-configs/${name}` : null
                });
            });

            this.configsAsLinks = aux;
        }
    }

    ngOnInit() {
    }
}
