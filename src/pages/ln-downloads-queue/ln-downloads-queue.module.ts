import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadsQueuePage } from "./ln-downloads-queue";
import { LnImgSrcDirectiveModule } from "../../directives/ln-img-src/ln-img-src.module";

@NgModule({
  declarations: [
    LnDownloadsQueuePage,
  ],
  imports: [
    IonicPageModule.forChild(LnDownloadsQueuePage),
    LnImgSrcDirectiveModule
  ],
  exports: [
    LnDownloadsQueuePage
  ]
})
export class LnDownloadsPageModule {}
