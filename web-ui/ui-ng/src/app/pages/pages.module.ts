import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BasicsModule } from '../basics';
import { PagesRoutingModule } from './pages-routing.module';
import { PipesModule } from '../pipes';
import { SectionsModule } from '../sections';

import { ConfigsComponent } from './configs/configs.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { FullInfoComponent } from './full-info/full-info.component';
import { LoadersComponent } from './loaders/loaders.component';
import { MiddlewaresComponent } from './middlewares/middlewares.component';
import { MockRoutesComponent } from './mock-routes/mock-routes.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PluginsComponent } from './plugins/plugins.component';
import { QuickComponent } from './quick/quick.component';
import { RoutesComponent } from './routes/routes.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
    declarations: [
        ConfigsComponent,
        EndpointsComponent,
        FullInfoComponent,
        LoadersComponent,
        MiddlewaresComponent,
        MockRoutesComponent,
        NotFoundComponent,
        PluginsComponent,
        QuickComponent,
        RoutesComponent,
        TasksComponent,
    ],
    imports: [
        BasicsModule,
        CommonModule,
        FontAwesomeModule,
        PagesRoutingModule,
        PipesModule,
        SectionsModule,
    ],
})
export class PagesModule { }
