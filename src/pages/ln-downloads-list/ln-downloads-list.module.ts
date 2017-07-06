import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadsListPage } from './ln-downloads-list';
import { LnNovelListModule } from "../../components/ln-novel-list/ln-novel-list.module";

@NgModule({
  declarations: [
    LnDownloadsListPage,
  ],
  imports: [
    LnNovelListModule,
    IonicPageModule.forChild(LnDownloadsListPage),
  ],
  exports: [
    LnDownloadsListPage
  ]
})
export class LnDownloadsListPageModule {}
