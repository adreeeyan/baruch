import { NgModule } from '@angular/core';
import { LnChapterReader } from './ln-chapter-reader';
import { LnLoadingModule } from "../ln-loading/ln-loading.module";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [
    LnChapterReader,
  ],
  imports: [
    IonicPageModule.forChild(LnChapterReader),
    LnLoadingModule
  ],
  exports: [
    LnChapterReader
  ]
})
export class LnChapterReaderModule {}
