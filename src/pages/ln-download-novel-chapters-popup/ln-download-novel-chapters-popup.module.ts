import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadNovelChaptersPopup } from "./ln-download-novel-chapters-popup";

@NgModule({
  declarations: [
    LnDownloadNovelChaptersPopup
  ],
  imports: [
    IonicPageModule.forChild(LnDownloadNovelChaptersPopup),
  ],
  exports: [
    LnDownloadNovelChaptersPopup
  ]
})
export class LnDownloadNovelChaptersPopupModule {}
