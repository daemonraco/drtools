import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigsComponent } from './configs/configs.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: 'configs', component: ConfigsComponent, },

    { path: '', component: HomeComponent, },
    { path: '**', component: NotFoundComponent, },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
