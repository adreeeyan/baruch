import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnAbout } from "./ln-about";

@NgModule({
  declarations: [
    LnAbout,
  ],
  imports: [
    IonicPageModule.forChild(LnAbout)
  ],
  exports: [
    LnAbout
  ]
})
export class LnAboutModule {}
