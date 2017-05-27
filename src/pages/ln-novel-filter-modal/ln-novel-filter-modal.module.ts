import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnNovelFilterModal } from "./ln-novel-filter-modal";

@NgModule({
  declarations: [
    LnNovelFilterModal,
  ],
  imports: [
    IonicPageModule.forChild(LnNovelFilterModal)
  ],
  exports: [
    LnNovelFilterModal
  ]
})
export class LnNovelFilterModalModule {}
