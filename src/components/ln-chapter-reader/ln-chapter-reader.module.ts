import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnChapterReader } from './ln-chapter-reader';

@NgModule({
  declarations: [
    LnChapterReader,
  ],
  imports: [
    IonicPageModule.forChild(LnChapterReader),
  ],
  exports: [
    LnChapterReader
  ]
})
export class LnChapterReaderModule {}
