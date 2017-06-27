import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LnNovelList } from './ln-novel-list';

@NgModule({
  declarations: [
    LnNovelList,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    LnNovelList
  ]
})
export class LnNovelListModule {}
