import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BooleanComponent } from './boolean/boolean.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    declarations: [
        BooleanComponent,
        FooterComponent,
        NavbarComponent,
    ],
    exports: [
        BooleanComponent,
        FooterComponent,
        NavbarComponent,
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule,
    ],
})
export class BasicsModule { }
