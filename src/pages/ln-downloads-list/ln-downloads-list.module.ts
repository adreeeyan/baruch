import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadsListPage } from './ln-downloads-list';
import { LnNovelListModule } from "../../components/ln-novel-list/ln-novel-list.module";
import { LnImgSrcDirectiveModule } from "../../directives/ln-img-src/ln-img-src.module";

@NgModule({
  declarations: [
    LnDownloadsListPage,
  ],
  imports: [
    LnNovelListModule,
    LnImgSrcDirectiveModule,
    IonicPageModule.forChild(LnDownloadsListPage),
  ],
  exports: [
    LnDownloadsListPage
  ]
})
export class LnDownloadsListPageModule {}
