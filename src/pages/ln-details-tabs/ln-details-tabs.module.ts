import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnDetailsTabs } from './ln-details-tabs';

@NgModule({
  declarations: [
    LnDetailsTabs,
  ],
  imports: [
    IonicPageModule.forChild(LnDetailsTabs),
  ],
  exports: [
    LnDetailsTabs
  ]
})
export class LnDetailsTabsModule {}
