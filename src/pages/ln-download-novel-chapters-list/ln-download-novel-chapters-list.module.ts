import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadNovelChaptersListPage } from './ln-download-novel-chapters-list';

@NgModule({
  declarations: [
    LnDownloadNovelChaptersListPage,
  ],
  imports: [
    IonicPageModule.forChild(LnDownloadNovelChaptersListPage),
  ],
  exports: [
    LnDownloadNovelChaptersListPage
  ]
})
export class LnDownloadNovelChaptersListPageModule {}
