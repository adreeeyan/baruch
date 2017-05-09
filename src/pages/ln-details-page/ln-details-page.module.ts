import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDetailsPage } from './ln-details-page';

@NgModule({
  declarations: [
    LnDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LnDetailsPage),
  ],
  exports: [
    LnDetailsPage
  ]
})
export class LnDetailsPageModule {}
