import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnList } from './ln-list';
import { LnNovelListModule } from "../../components/ln-novel-list/ln-novel-list.module";

@NgModule({
  declarations: [
    LnList,
  ],
  imports: [
    LnNovelListModule,
    IonicPageModule.forChild(LnList),
  ],
  exports: [
    LnList
  ]
})
export class LnListModule {}
