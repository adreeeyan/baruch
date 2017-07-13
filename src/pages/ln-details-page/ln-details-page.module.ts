import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDetailsPage } from './ln-details-page';
import { LnImgSrcDirectiveModule } from "../../directives/ln-img-src/ln-img-src.module";

@NgModule({
  declarations: [
    LnDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LnDetailsPage),
    LnImgSrcDirectiveModule
  ],
  exports: [
    LnDetailsPage
  ]
})
export class LnDetailsPageModule {}
