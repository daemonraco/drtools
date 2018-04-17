import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageHomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: PageHomeComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
