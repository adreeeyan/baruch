import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnSearchPage } from './ln-search-page';

@NgModule({
    declarations: [
        LnSearchPage,
    ],
    imports: [
        IonicPageModule.forChild(LnSearchPage),
    ],
    exports: [
        LnSearchPage
    ]
})
export class LnSearchPageModule { }
