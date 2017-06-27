import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnSearchPage } from './ln-search-page';
import { LnNovelListModule } from "../../components/ln-novel-list/ln-novel-list.module";

@NgModule({
    declarations: [
        LnSearchPage,
    ],
    imports: [
        LnNovelListModule,
        IonicPageModule.forChild(LnSearchPage),
    ],
    exports: [
        LnSearchPage
    ]
})
export class LnSearchPageModule { }
