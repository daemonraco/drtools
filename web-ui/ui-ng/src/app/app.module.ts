import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { Page404Component } from './404/404.component';
import { PageDocsComponent } from './docs/docs.component';
import { PageHomeComponent } from './home/home.component';
import { PageHomeConfigsComponent } from './home/configs/configs.component';
import { PageHomeEndpointsComponent } from './home/endpoints/endpoints.component';
import { PageHomeLoadersComponent } from './home/loaders/loaders.component';
import { PageHomeMiddlewaresComponent } from './home/middlewares/middlewares.component';
import { PageHomeMockRoutesComponent } from './home/mock-routes/mock-routes.component';
import { PageHomeRoutesComponent } from './home/routes/routes.component';
import { PageHomeTasksComponent } from './home/tasks/tasks.component';

import { LocationService } from './services/location.service';

import { BooleanPipe } from './pipes/boolean.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { MillisecondsPipe } from './pipes/milliseconds.pipe';
import { MysqlRestComponent } from './home/mysql-rest/mysql-rest.component';

@NgModule({
    declarations: [
        AppComponent,
        BooleanPipe,
        FooterComponent,
        KeysPipe,
        MillisecondsPipe,
        NavbarComponent,
        Page404Component,
        PageDocsComponent,
        PageHomeComponent,
        PageHomeConfigsComponent,
        PageHomeEndpointsComponent,
        PageHomeLoadersComponent,
        PageHomeMiddlewaresComponent,
        PageHomeMockRoutesComponent,
        PageHomeRoutesComponent,
        PageHomeTasksComponent,
        MysqlRestComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpModule
    ],
    providers: [LocationService],
    bootstrap: [AppComponent]
})
export class AppModule { }
