import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnReaderSettingsModal } from './ln-chapter-page';

@NgModule({
  declarations: [
    LnReaderSettingsModal,
  ],
  imports: [
    IonicPageModule.forChild(LnReaderSettingsModal),
  ],
  exports: [
    LnReaderSettingsModal
  ]
})
export class LnReaderSettingsModalModule {}
