import { Component, OnInit } from '@angular/core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { DRToolsService } from 'src/app/services';

interface ISection {
    description?: string,
    icon: any,
    link: string,
    title: string,
}

@Component({
    selector: 'app-quick',
    templateUrl: './quick.component.html',
})
export class QuickComponent implements OnInit {
    //
    // Properties.
    public drtools: any = {};
    public readonly icons = Icons;
    public sections: ISection[] = [];
    //
    // Construction.
    constructor(protected drtSrv: DRToolsService) {
    }
    //
    // Public methods.
    public async ngOnInit(): Promise<void> {
        this.sections = [];
        this.drtools = await this.drtSrv.info();

        if (this.drtools.configs) {
            this.sections.push({
                icon: Icons.faCogs,
                link: '../configs',
                title: 'Configs',
            });
        }
        if (this.drtools.endpoints) {
            this.sections.push({
                icon: Icons.faAsterisk,
                link: '../endpoints',
                title: 'Endpoints',
            });
        }
        if (this.drtools.loaders) {
            this.sections.push({
                icon: Icons.faSpinner,
                link: '../loaders',
                title: 'Loaders',
            });
        }
        if (this.drtools.middlewares) {
            this.sections.push({
                icon: Icons.faPrescriptionBottle,
                link: '../middlewares',
                title: 'Middlewares',
            });
        }
        if (this.drtools.routes) {
            this.sections.push({
                icon: Icons.faMapSigns,
                link: '../routes',
                title: 'Routes',
            });
        }
        if (this.drtools.mockRoutes) {
            this.sections.push({
                icon: Icons.faMapSigns,
                link: '../mock-routes',
                title: 'Mock Routes',
            });
        }
        if (this.drtools.tasks) {
            this.sections.push({
                icon: Icons.faClock,
                link: '../tasks',
                title: 'Tasks',
            });
        }
        if (this.drtools.plugins) {
            this.sections.push({
                icon: Icons.faPlug,
                link: '../plugins',
                title: 'Plugins',
            });
        }
    }
    //
    // Protected methods.

}
