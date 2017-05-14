import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnReaderSettingsModal } from "./ln-reader-settings-modal";

@NgModule({
  declarations: [
    LnReaderSettingsModal,
  ],
  imports: [
    IonicPageModule.forChild(LnReaderSettingsModal)
  ],
  exports: [
    LnReaderSettingsModal
  ]
})
export class LnReaderSettingsModalModule {}
