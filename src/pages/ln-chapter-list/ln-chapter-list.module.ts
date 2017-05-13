import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnChapterListPage } from './ln-chapter-list';

@NgModule({
  declarations: [
    LnChapterListPage,
  ],
  imports: [
    IonicPageModule.forChild(LnChapterListPage),
  ],
  exports: [
    LnChapterListPage
  ]
})
export class LnChapterListPageModule {}
