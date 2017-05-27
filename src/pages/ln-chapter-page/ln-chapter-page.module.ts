import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnChapterPage } from './ln-chapter-page';
import { LnChapterReaderModule } from "../../components/ln-chapter-reader/ln-chapter-reader.module";

@NgModule({
  declarations: [
    LnChapterPage
  ],
  imports: [
    IonicPageModule.forChild(LnChapterPage),
    LnChapterReaderModule
  ],
  exports: [
    LnChapterPage
  ]
})
export class LnChapterPageModule {}
