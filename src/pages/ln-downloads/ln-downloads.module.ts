import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDownloadsPage } from './ln-downloads';

@NgModule({
  declarations: [
    LnDownloadsPage,
  ],
  imports: [
    IonicPageModule.forChild(LnDownloadsPage),
  ],
  exports: [
    LnDownloadsPage
  ]
})
export class LnDownloadsPageModule {}
