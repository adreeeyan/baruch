import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnRecentNovelsPage } from './ln-recent-novels';
import { LnNovelListModule } from "../../components/ln-novel-list/ln-novel-list.module";

@NgModule({
  declarations: [
    LnRecentNovelsPage,
  ],
  imports: [
    LnNovelListModule,
    IonicPageModule.forChild(LnRecentNovelsPage),
  ],
  exports: [
    LnRecentNovelsPage
  ]
})
export class LnRecentNovelsPageModule {}
