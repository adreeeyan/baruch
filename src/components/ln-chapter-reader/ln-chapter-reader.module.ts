import { NgModule } from '@angular/core';
import { LnChapterReader } from './ln-chapter-reader';
import { IonicPageModule } from "ionic-angular";

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
