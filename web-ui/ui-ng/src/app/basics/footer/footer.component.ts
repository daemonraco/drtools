import { Component, OnInit } from '@angular/core';

import { DRToolsService } from 'src/app/services';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
    //
    // Properties.
    public version: string = '';
    //
    // Construction.
    constructor(protected drSrv: DRToolsService) {
    }
    //
    // Public methods.
    public async ngOnInit(): Promise<void> {
        const info: any = await this.drSrv.info();
        this.version = info.$system.version;
    }
    //
    // Protected methods.

}
