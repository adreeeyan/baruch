import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnChapterPage } from './ln-chapter-page';
import { LnChapterReaderModule } from "../../components/ln-chapter-reader/ln-chapter-reader.module";
import { LnLoadingModule } from "../../components/ln-loading/ln-loading.module";

@NgModule({
  declarations: [
    LnChapterPage
  ],
  imports: [
    IonicPageModule.forChild(LnChapterPage),
    LnLoadingModule,
    LnChapterReaderModule
  ],
  exports: [
    LnChapterPage
  ]
})
export class LnChapterPageModule {}
