import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { MillisecondsPipe } from './milliseconds.pipe';

@NgModule({
    declarations: [
        KeysPipe,
        MillisecondsPipe,
    ],
    exports: [
        KeysPipe,
        MillisecondsPipe,
    ],
    imports: [
        CommonModule,
    ],
})
export class PipesModule { }
