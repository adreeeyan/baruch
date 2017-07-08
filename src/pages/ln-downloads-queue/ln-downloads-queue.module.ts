import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadsQueuePage } from "./ln-downloads-queue";

@NgModule({
  declarations: [
    LnDownloadsQueuePage,
  ],
  imports: [
    IonicPageModule.forChild(LnDownloadsQueuePage),
  ],
  exports: [
    LnDownloadsQueuePage
  ]
})
export class LnDownloadsPageModule {}
