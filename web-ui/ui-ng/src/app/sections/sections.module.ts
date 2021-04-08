import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HighlightModule } from 'ngx-highlightjs';
import { NgModule } from '@angular/core';

import { BasicsModule } from '../basics';
import { PipesModule } from '../pipes';

import { ConfigsComponent } from './configs/configs.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { LoadersComponent } from './loaders/loaders.component';
import { MiddlewaresComponent } from './middlewares/middlewares.component';
import { MockRoutesComponent } from './mock-routes/mock-routes.component';
import { PluginsComponent } from './plugins/plugins.component';
import { RoutesComponent } from './routes/routes.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
    declarations: [
        ConfigsComponent,
        EndpointsComponent,
        LoadersComponent,
        MiddlewaresComponent,
        MockRoutesComponent,
        PluginsComponent,
        RoutesComponent,
        TasksComponent,
    ],
    exports: [
        ConfigsComponent,
        EndpointsComponent,
        LoadersComponent,
        MiddlewaresComponent,
        MockRoutesComponent,
        PluginsComponent,
        RoutesComponent,
        TasksComponent,
    ],
    imports: [
        BasicsModule,
        CommonModule,
        FontAwesomeModule,
        HighlightModule,
        PipesModule,
    ],
})
export class SectionsModule { }
