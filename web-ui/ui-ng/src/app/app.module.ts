import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BasicsModule } from './basics';
import { PagesModule } from './pages';
import { PipesModule } from './pipes';
import { SectionsModule } from './sections';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        BasicsModule,
        BrowserModule,
        FontAwesomeModule,
        HttpClientModule,
        PagesModule,
        PipesModule,
        SectionsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
