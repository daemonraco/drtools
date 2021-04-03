import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BasicsModule } from './basics';

import { AppComponent } from './app.component';
import { ConfigsComponent } from './home/configs/configs.component';
import { DocsComponent } from './docs/docs.component';
import { EndpointsComponent } from './home/endpoints/endpoints.component';
import { HomeComponent } from './home/home.component';
import { LoadersComponent } from './home/loaders/loaders.component';
import { MiddlewaresComponent } from './home/middlewares/middlewares.component';
import { MockRoutesComponent } from './home/mock-routes/mock-routes.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PluginsComponent } from './home/plugins/plugins.component';
import { RoutesComponent } from './home/routes/routes.component';
import { TasksComponent } from './home/tasks/tasks.component';

import { BooleanPipe } from './pipes/boolean.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { MillisecondsPipe } from './pipes/milliseconds.pipe';

@NgModule({
    declarations: [
        AppComponent,
        BooleanPipe,
        ConfigsComponent,
        DocsComponent,
        EndpointsComponent,
        HomeComponent,
        KeysPipe,
        LoadersComponent,
        MiddlewaresComponent,
        MillisecondsPipe,
        MockRoutesComponent,
        NotFoundComponent,
        PluginsComponent,
        RoutesComponent,
        TasksComponent,
    ],
    imports: [
        AppRoutingModule,
        BasicsModule,
        BrowserModule,
        FontAwesomeModule,
        HttpClientModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
