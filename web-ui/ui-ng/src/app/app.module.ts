import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BasicsModule } from './basics';
import { PipesModule } from './pipes';
import { SectionsModule } from './sections';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConfigsComponent } from './configs/configs.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NotFoundComponent,
        ConfigsComponent,
    ],
    imports: [
        AppRoutingModule,
        BasicsModule,
        BrowserModule,
        FontAwesomeModule,
        HttpClientModule,
        PipesModule,
        SectionsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
