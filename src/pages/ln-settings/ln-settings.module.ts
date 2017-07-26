import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnSettings } from "./ln-settings";

@NgModule({
  declarations: [
    LnSettings,
  ],
  imports: [
    IonicPageModule.forChild(LnSettings)
  ],
  exports: [
    LnSettings
  ]
})
export class LnSettingsModule {}
