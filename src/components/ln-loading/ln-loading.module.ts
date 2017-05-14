import { NgModule } from '@angular/core';
import { LnLoading } from "./ln-loading";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [
    LnLoading,
  ],
  imports:[
    IonicPageModule.forChild(LnLoading),
  ],
  exports: [
    LnLoading
  ]
})
export class LnLoadingModule {}
