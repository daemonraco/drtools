import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { DRToolsService } from '../services/drtools.service';

@Component({
    selector: 'ui-docs',
    templateUrl: './docs.component.html',
    styles: [],
    providers: [DRToolsService]
})
export class PageDocsComponent implements OnInit {
    public data: any = {};

    constructor(
        private drtSrv: DRToolsService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            const doc: string = params.doc || 'README.md';
            this.drtSrv.doc(doc).subscribe((data: any) => {
                this.data = data;
                this.data.html = this.sanitizer.bypassSecurityTrustHtml(this.adaptLinks(this.data.html));
            });
        });
    }

    protected adaptLinks(html: string): string {
        const patternLink: RegExp = new RegExp('<a(.*)href="(.*)\.md"', 'g');
        const patternHash: RegExp = new RegExp('<a(.*)href="#(.*)"', 'g');
        const urlPieces: string[] = this.router.url.replace('#', '?').split('?');

        html = html.replace(patternLink, `<a\$1href="${location.pathname}?doc=\$2.md"`);
        html = html.replace(patternHash, `<a\$1href="${location.pathname}${urlPieces.length > 1 ? `?${urlPieces[1]}` : ''}#\$2"`);

        return html;
    }
}
