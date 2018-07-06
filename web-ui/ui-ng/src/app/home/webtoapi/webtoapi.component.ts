import { Component, Input, OnChanges, OnInit } from '@angular/core';

declare var $: any;

@Component({
    selector: 'ui-home-webtoapi',
    templateUrl: './webtoapi.component.html',
    styles: []
})
export class PageHomeWebtoapiComponent implements OnChanges, OnInit {
    @Input('server') public server: string = '';
    @Input('webtoapi') public webtoapi: any = null;

    public displayData: any = {};

    constructor() {
    }

    public displayEndpoint(endpoint: any): void {
        this.displayData = endpoint;
        $('#WAEndpointModal').modal('show');
    }

    ngOnChanges() {
        if (Array.isArray(this.webtoapi)) {
            for (const conf of this.webtoapi) {
                if (Array.isArray(conf.routes)) {
                    for (const route of conf.routes) {
                        route.mapNG = [];
                        for (const k of Object.keys(route.map)) {
                            route.mapNG.push({
                                name: k,
                                value: route.map[k]
                            });
                        }
                    }
                }

                conf.parsersNG = [];
                if (Array.isArray(conf.parsers)) {
                    for (const parser of conf.parsers) {
                        conf.parsersNG.push({
                            code: parser,
                            path: null
                        });
                    }
                }

                conf.endpointsNG = [];
                for (const key of Object.keys(conf.endpoints)) {
                    const endpoint = JSON.parse(JSON.stringify(conf.endpoints[key]));
                    endpoint.hasHeaders = Object.keys(endpoint.headers).length > 0;

                    conf.endpointsNG.push(endpoint)
                }
            }
        }
    }
    ngOnInit() {
    }
}
