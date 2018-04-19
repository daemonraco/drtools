import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from './404/404.component';
import { PageDocsComponent } from './docs/docs.component';
import { PageHomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: PageHomeComponent },
    { path: 'docs', component: PageDocsComponent },
    { path: '**', component: Page404Component },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
