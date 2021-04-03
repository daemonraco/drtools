import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsComponent } from './docs/docs.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: 'docs', component: DocsComponent, },
    { path: '', component: HomeComponent, },

    { path: '**', component: NotFoundComponent, },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
