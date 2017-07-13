import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LnNovelList } from './ln-novel-list';
import { LnImgSrcDirectiveModule } from "../../directives/ln-img-src/ln-img-src.module";

@NgModule({
  declarations: [
    LnNovelList
  ],
  imports: [
    IonicModule,
    LnImgSrcDirectiveModule
  ],
  exports: [
    LnNovelList
  ]
})
export class LnNovelListModule {}
