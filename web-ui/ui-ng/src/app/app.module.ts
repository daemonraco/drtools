import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BasicsModule } from './basics';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeConfigsComponent } from './home/configs/configs.component';
import { HomeEndpointsComponent } from './home/endpoints/endpoints.component';
import { HomeLoadersComponent } from './home/loaders/loaders.component';
import { HomeMiddlewaresComponent } from './home/middlewares/middlewares.component';
import { HomeMockRoutesComponent } from './home/mock-routes/mock-routes.component';
import { HomePluginsComponent } from './home/plugins/plugins.component';
import { HomeRoutesComponent } from './home/routes/routes.component';
import { HomeTasksComponent } from './home/tasks/tasks.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { BooleanPipe } from './pipes/boolean.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { MillisecondsPipe } from './pipes/milliseconds.pipe';

@NgModule({
    declarations: [
        AppComponent,
        BooleanPipe,
        HomeComponent,
        HomeConfigsComponent,
        HomeEndpointsComponent,
        HomeLoadersComponent,
        HomeMiddlewaresComponent,
        HomeMockRoutesComponent,
        HomePluginsComponent,
        HomeRoutesComponent,
        HomeTasksComponent,
        KeysPipe,
        MillisecondsPipe,
        NotFoundComponent,
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
