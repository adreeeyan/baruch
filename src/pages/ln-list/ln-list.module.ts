import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnList } from './ln-list';

@NgModule({
  declarations: [
    LnList,
  ],
  imports: [
    IonicPageModule.forChild(LnList),
  ],
  exports: [
    LnList
  ]
})
export class LnListModule {}
