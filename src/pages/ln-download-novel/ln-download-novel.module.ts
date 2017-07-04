import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadNovelPage } from './ln-download-novel';

@NgModule({
  declarations: [
    LnDownloadNovelPage
  ],
  imports: [
    IonicPageModule.forChild(LnDownloadNovelPage),
  ],
  exports: [
    LnDownloadNovelPage
  ]
})
export class LnDownloadNovelPageModule {}
