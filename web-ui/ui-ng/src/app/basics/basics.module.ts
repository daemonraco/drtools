import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    declarations: [
        FooterComponent,
        NavbarComponent,
    ],
    exports: [
        FooterComponent,
        NavbarComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
})
export class BasicsModule { }
