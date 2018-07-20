import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LnChapterListPage } from './ln-chapter-list';
import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [
    LnChapterListPage,
  ],
  imports: [
    IonicPageModule.forChild(LnChapterListPage),
    MomentModule
  ],
  exports: [
    LnChapterListPage
  ]
})
export class LnChapterListPageModule {}
