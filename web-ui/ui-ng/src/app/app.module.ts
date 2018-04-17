import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PageHomeComponent } from './home/home.component';

import { LocationService } from './services/location.service';
import { PageHomeConfigsComponent } from './home/configs/configs.component';
import { PageHomeEndpointsComponent } from './home/endpoints/endpoints.component';
import { PageHomeLoadersComponent } from './home/loaders/loaders.component';
import { PageHomeMiddlewaresComponent } from './home/middlewares/middlewares.component';
import { PageHomeRoutesComponent } from './home/routes/routes.component';
import { PageHomeTasksComponent } from './home/tasks/tasks.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        NavbarComponent,
        PageHomeComponent,
        PageHomeConfigsComponent,
        PageHomeEndpointsComponent,
        PageHomeLoadersComponent,
        PageHomeMiddlewaresComponent,
        PageHomeRoutesComponent,
        PageHomeTasksComponent
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
