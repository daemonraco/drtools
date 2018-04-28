import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { DRToolsService } from '../services/drtools.service';

declare var $: any;
declare var hljs: any;

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

                setTimeout(() => {
                    const pres: any = document.querySelectorAll('ui-docs pre');
                    [].forEach.call(pres, (block: any) => {
                        hljs.highlightBlock(block);
                    });

                    const tables: any = document.querySelectorAll('ui-docs table');
                    [].forEach.call(tables, (table: any) => {
                        table.classList.add('table');
                        table.classList.add('table-striped');
                    });

                    const hs: any = document.querySelectorAll('ui-docs h2,ui-docs h3');
                    [].forEach.call(hs, (h: any) => {
                        h.classList.add('border-bottom');
                        h.classList.add('mt-4');
                        h.classList.add('py-1');
                    });

                    const as: any = document.querySelectorAll('ui-docs a');
                    const asPattern: RegExp = RegExp(`^(\/|${location.protocol}\/\/${location.host})`);
                    [].forEach.call(as, (a: any) => {
                        a.addEventListener('click', (event: any) => {
                            const currentUrl: string = location.href.split('#')[0];
                            const linkUrl: string = a.href.split('#')[0];

                            if (currentUrl !== linkUrl && a.href.match(asPattern)) {
                                event.preventDefault();

                                const shortUrl: string = event.target.href.replace(`${location.protocol}//${location.host}`, '');
                                this.router.navigateByUrl(shortUrl);
                            }
                        });
                    });

                    $(window).scrollTop(0);
                }, 100);
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
