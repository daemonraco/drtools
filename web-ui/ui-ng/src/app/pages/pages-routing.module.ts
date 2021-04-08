import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
    { path: 'configs', component: ConfigsComponent, },
    { path: 'endpoints', component: EndpointsComponent, },
    { path: 'loaders', component: LoadersComponent, },
    { path: 'middlewares', component: MiddlewaresComponent, },
    { path: 'mock-routes', component: MockRoutesComponent, },
    { path: 'plugins', component: PluginsComponent, },
    { path: 'routes', component: RoutesComponent, },
    { path: 'tasks', component: TasksComponent, },

    { path: 'full', component: FullInfoComponent, },

    { path: '', component: QuickComponent, },
    { path: '**', component: NotFoundComponent, },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule { }
