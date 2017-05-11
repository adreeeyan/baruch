import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnChapterPage } from './ln-chapter-page';

@NgModule({
  declarations: [
    LnChapterPage,
  ],
  imports: [
    IonicPageModule.forChild(LnChapterPage),
  ],
  exports: [
    LnChapterPage
  ]
})
export class LnChapterPageModule {}
